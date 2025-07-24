mkdir -p backend/docker
curl -fsSL \
  https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
  -o backend/docker/wait-for-it.sh
chmod +x backend/docker/wait-for-it.sh
