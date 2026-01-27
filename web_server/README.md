web_server can be run by

kubectl apply -f /home/user/mooc-kubernetes/namespaces
kubectl apply -f /home/user/mooc-kubernetes/PVs
kubectl apply -f /home/user/mooc-kubernetes/todo-backend/manifests
kubectl apply -f /home/user/mooc-kubernetes/web_server/manifests

or 

run 

kubectl apply -k /home/user/mooc-Kubernetes/kustomize/project

or 

github actions

Docker images are public


### DBaaS vs DIY

DBaaS 

Pros: 
- Easy set up as you can have db ready in minutes
- Less to worry as backups and security issues are done by the service provider
- Scalability is good as upgrading storage is easy 
Cons: 
- Higher cost
- You are limited to what the provider offers. Custom integrations are not always viable for example 
- Chaning or exporting data can be hard

DIY 
Pros:
- You only pay for the server and the disk space 
- You can configure everything the way you like
- No lock in
Cons: 
- Labor intensive to setup and maintain
- You are responsible for updates and backups
- Harder to setup failover without dataloss