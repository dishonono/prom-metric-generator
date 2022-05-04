#!/usr/bin/env bash

abort()
{
    echo >&2 '
***************
*** ABORTED ***
***************
'
    echo "An error occurred. Exiting..." >&2
    read -p "Press any key to resume ..."
    exit 1
}

trap 'abort' 0
set -e # make it exit on the first error


#export DOCKER_BUILDKIT=1
#export COMPOSE_DOCKER_CLI_BUILD=0

build_docker_and_deploy () {
    app=$1
    version=$(az acr repository show-tags -n promalertsacr --subscription 72fa99ef-9c84-4a7c-b343-ec62da107d81 --repository $app --top 1 --orderby time_desc | \
        python -c "import sys, json; va = json.load(sys.stdin)[0].split('.'); print(va[0]+'.'+va[1]+'.'+str(int(va[2])+1))")

    echo "Will deploy $app with version $version"

    docker build -t $app:latest . 
    docker tag $app:latest promalertsacr.azurecr.io/$app:$version
    docker push promalertsacr.azurecr.io/$app:$version
    kubectl set image deploy $app $app=promalertsacr.azurecr.io/$app:$version -n node

    echo "Deployed $app with version $version"
    sed -i "s/promalertsacr.azurecr.io\/$app:v1\.[[:digit:]]\.[[:digit:]][[:digit:]]/promalertsacr.azurecr.io\/$app:$version/g" ../conf1.yaml
    echo "Finished changing conf file for app $app"
}

echo "Logging in"
az acr login -n promalertsacr --subscription 72fa99ef-9c84-4a7c-b343-ec62da107d81
az aks get-credentials --admin --overwrite-existing --name DevCluster -g DevCluster --subscription 72fa99ef-9c84-4a7c-b343-ec62da107d81


cd app
build_docker_and_deploy web
cd ..

cd client
build_docker_and_deploy client
cd ..

#kubectl apply -f conf1.yaml


trap : 0 
echo >&2

read -p "Success! Press any key to resume ..."


 