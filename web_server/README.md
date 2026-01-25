web_server can be run by

kubectl apply -f /home/user/mooc-kubernetes/namespaces
kubectl apply -f /home/user/mooc-kubernetes/PVs
kubectl apply -f /home/user/mooc-kubernetes/todo-backend/manifests
kubectl apply -f /home/user/mooc-kubernetes/web_server/manifests

or 

run 

kubectl apply -k /home/user/mooc-Kubernetes/kustomize/project

Docker images are public