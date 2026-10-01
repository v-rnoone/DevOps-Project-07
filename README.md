# Task Tracker - DevOps project

Flow: git push -> GitLab CI (test -> build images -> deploy) -> OpenShift

## 1. Run locally
    docker compose up --build
    open http://localhost:8081

## 2. One-time OpenShift setup
    oc new-project task-tracker

    # Let OpenShift pull images from the GitLab registry (create a Deploy Token
    # in GitLab: Settings > Repository > Deploy tokens, scope read_registry)
    oc create secret docker-registry gitlab-registry \
      --docker-server=registry.gitlab.com \
      --docker-username=<deploy-token-username> \
      --docker-password=<deploy-token-value>
    oc secrets link default gitlab-registry --for=pull

    # Service account that GitLab will use to deploy
    oc create sa gitlab-deployer
    oc policy add-role-to-user edit -z gitlab-deployer
    oc create token gitlab-deployer --duration=8760h   # copy this token

## 3. GitLab variables (Settings > CI/CD > Variables)
| Name | Value | Options |
|---|---|---|
| OPENSHIFT_SERVER | https://api.your-cluster:6443 | - |
| OPENSHIFT_TOKEN | token from step 2 | Masked, Protected |
| OPENSHIFT_NAMESPACE | task-tracker | - |

## 4. Deploy
    git init && git add . && git commit -m "first commit"
    git remote add origin <your-gitlab-repo-url>
    git push -u origin main

Watch the pipeline. The last job prints the app URL.
