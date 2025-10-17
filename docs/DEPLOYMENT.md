# Deployment Guide

## Overview

This guide covers deploying the Anime Streaming Platform to production environments.

## Prerequisites

- AWS Account with appropriate permissions
- Domain name configured
- SSL/TLS certificates
- Docker Hub account (or alternative container registry)
- Kubernetes cluster (EKS, GKE, or self-managed)
- Terraform installed (for IaC deployment)

## Deployment Options

### Option 1: Docker Compose (Simple)

Best for: Small deployments, development staging

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Option 2: Kubernetes (Recommended)

Best for: Production, scalable deployments

#### Step 1: Build and Push Images

```bash
# Build images
docker build -t your-registry/anime-platform-api:latest ./services/api
docker build -t your-registry/anime-platform-web:latest ./apps/web

# Push to registry
docker push your-registry/anime-platform-api:latest
docker push your-registry/anime-platform-web:latest
```

#### Step 2: Configure Secrets

```bash
# Create namespace
kubectl create namespace anime-platform

# Create secrets
kubectl create secret generic db-secret \
  --from-literal=host=your-db-host \
  --from-literal=password=your-db-password \
  -n anime-platform

kubectl create secret generic jwt-secret \
  --from-literal=secret=your-jwt-secret \
  -n anime-platform
```

#### Step 3: Deploy to Kubernetes

```bash
# Apply configurations
kubectl apply -f infrastructure/kubernetes/deployment.yaml

# Check deployment
kubectl get pods -n anime-platform
kubectl get services -n anime-platform
```

#### Step 4: Configure Ingress

```yaml
# infrastructure/kubernetes/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: anime-platform-ingress
  namespace: anime-platform
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - animeplatform.com
    - api.animeplatform.com
    secretName: anime-platform-tls
  rules:
  - host: animeplatform.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
  - host: api.animeplatform.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
```

### Option 3: AWS with Terraform (Infrastructure as Code)

Best for: Production on AWS with full infrastructure automation

#### Step 1: Configure Terraform Variables

```bash
cd infrastructure/terraform

# Create terraform.tfvars
cat > terraform.tfvars << EOF
aws_region = "us-east-1"
environment = "production"
project_name = "anime-platform"
db_password = "your-secure-password"
EOF
```

#### Step 2: Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply infrastructure
terraform apply

# Get outputs
terraform output
```

#### Step 3: Deploy Application

```bash
# Update ECS task definitions with new images
aws ecs update-service \
  --cluster anime-platform-cluster \
  --service api-service \
  --force-new-deployment

aws ecs update-service \
  --cluster anime-platform-cluster \
  --service web-service \
  --force-new-deployment
```

## Environment Configuration

### Production Environment Variables

#### API Service

```env
NODE_ENV=production
PORT=3001

# Database
DB_HOST=<rds-endpoint>
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<secure-password>
DB_DATABASE=anime_platform

# Redis
REDIS_HOST=<elasticache-endpoint>
REDIS_PORT=6379

# JWT
JWT_SECRET=<secure-random-string>
JWT_EXPIRES_IN=7d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_S3_BUCKET=anime-platform-videos
AWS_CLOUDFRONT_DOMAIN=<cloudfront-domain>

# Stripe
STRIPE_SECRET_KEY=<live-secret-key>
STRIPE_WEBHOOK_SECRET=<webhook-secret>

# OAuth
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
GOOGLE_CALLBACK_URL=https://api.animeplatform.com/api/auth/google/callback

# Monitoring
SENTRY_DSN=<your-sentry-dsn>

# Frontend URL
FRONTEND_URL=https://animeplatform.com
```

#### Web Frontend

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.animeplatform.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<publishable-key>
```

## Database Migration

### Run Migrations in Production

```bash
# SSH into API container or use kubectl exec
kubectl exec -it <api-pod-name> -n anime-platform -- /bin/sh

# Run migrations
npm run migration:run

# Or use TypeORM CLI
npx typeorm migration:run
```

### Backup Database Before Migration

```bash
# PostgreSQL backup
pg_dump -h <db-host> -U postgres anime_platform > backup.sql

# Or use AWS RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier anime-platform-db \
  --db-snapshot-identifier anime-platform-backup-$(date +%Y%m%d)
```

## SSL/TLS Configuration

### Using Let's Encrypt with cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@animeplatform.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## CDN Configuration

### CloudFront Setup

1. Create distribution pointing to S3 bucket
2. Configure signed URLs for DRM
3. Set up custom domain
4. Enable HTTPS only

```bash
# Generate CloudFront key pair (for signed URLs)
aws cloudfront create-public-key --public-key-config file://public-key.json
```

## Monitoring Setup

### Prometheus + Grafana

```bash
# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
```

### Sentry Error Tracking

Add Sentry DSN to environment variables and initialize in code:

```typescript
// services/api/src/main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Scaling

### Horizontal Pod Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: anime-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling

- Use read replicas for read-heavy workloads
- Enable connection pooling
- Implement caching with Redis

## Health Checks

### Kubernetes Probes

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 3001
  initialDelaySeconds: 10
  periodSeconds: 5
```

## Rollback Strategy

### Kubernetes Rollback

```bash
# View deployment history
kubectl rollout history deployment/api-deployment -n anime-platform

# Rollback to previous version
kubectl rollout undo deployment/api-deployment -n anime-platform

# Rollback to specific revision
kubectl rollout undo deployment/api-deployment --to-revision=2 -n anime-platform
```

### Database Rollback

```bash
# Restore from backup
psql -h <db-host> -U postgres anime_platform < backup.sql

# Or restore RDS snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier anime-platform-db-restored \
  --db-snapshot-identifier anime-platform-backup-20240101
```

## Security Checklist

- [ ] All secrets stored in secure vault (AWS Secrets Manager, K8s Secrets)
- [ ] HTTPS enforced on all endpoints
- [ ] Database encryption at rest enabled
- [ ] VPC and security groups properly configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] Regular security updates scheduled
- [ ] Backups automated and tested

## Post-Deployment

### Verification Steps

1. **Check all services are running**
```bash
kubectl get pods -n anime-platform
```

2. **Test endpoints**
```bash
curl https://api.animeplatform.com/health
curl https://animeplatform.com
```

3. **Monitor logs**
```bash
kubectl logs -f deployment/api-deployment -n anime-platform
```

4. **Check metrics**
- CPU/Memory usage
- Response times
- Error rates

### Performance Optimization

- Enable CDN caching
- Optimize database queries
- Implement Redis caching
- Use connection pooling
- Enable gzip compression

## Troubleshooting

### Common Issues

**Pods not starting**
```bash
kubectl describe pod <pod-name> -n anime-platform
kubectl logs <pod-name> -n anime-platform
```

**Database connection issues**
```bash
# Test database connection
kubectl run -it --rm postgres-client --image=postgres:15 --restart=Never -- \
  psql -h <db-host> -U postgres -d anime_platform
```

**High memory usage**
```bash
# Check resource usage
kubectl top pods -n anime-platform
```

## Maintenance

### Regular Tasks

- **Daily**: Monitor error logs, check system health
- **Weekly**: Review performance metrics, check disk usage
- **Monthly**: Apply security patches, review costs
- **Quarterly**: Load testing, disaster recovery drill

## Support

For deployment issues:
1. Check logs and metrics
2. Review deployment documentation
3. Contact DevOps team
4. Create incident ticket

---

## Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
