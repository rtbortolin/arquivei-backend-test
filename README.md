# arquivei-backend-test
#
##### O desafio proposto foi desenvolvido separadamente em 2 projetos:
  - [Received NFe Consumer](#received-nfe-consumer)
  - [Received NFe Viewer](#received-nfe-viewer)

### Received NFe Consumer
  - Desenvolvido em NodeJs com Express
  - Responsável por cosumir a API de notas fiscais eletrônicas recebidas, tratar o retorno e enviar os dados para a API Received NFe Viewer

>   Toda vez que a URL `http://received-nfe-consumer-url/api/worker` é chamada, uma task em background é disparada e consome a API da Arquivei de página em página até o final das notas. Para cada NFe retornada na página, o retorno é tratado, convertido em objeto, e o valor da nota é encontrado neste objeto.
>   Após tratar a NFe, cada retorno é enviado para a API Received NFe Viewer.

### Received NFe Viewer

  - Desenvolvido em Java com SpringBoot e Postgres
  - Responsável por persistir os dados necessários da NFe e disponibilizar os dados por meio de uma API.

>   Os dados da NFe são recebidos por meio de uma requisição POST na URL `http://received-nfe-viewer-url/api/nfe`, os dados enviados são tratados e se tudo estiver de acordo, persistido no banco e o retorno de `criado` é devolvido ao consumidor.


Exemplo de request para persistir os dados:
```
curl -X POST \
  http://received-nfe-viewer-url/api/nfe \
  -H 'Content-Type: application/json' \
  -d '{"accessKey":"ffdfdfdf56","xml":"</xml>","totalValue":540.4}'
  ```
  
>   Os dados requisitados no desafio, é disponibilizado por uma requisição GET na URL `http://received-nfe-viewer-url/api/nfe/{access_key}`

Exemple de request para recuperar os dados:
```
curl -X GET \
  http://received-nfe-viewer-url/api/nfe/ffdfdfdf56 
```


## Executando os projetos

- Criando uma rede para os sistemas
```
        docker network create --driver bridge rtbortolin-arquivei-network
```
### Docker do Postgres (Opcional)
 
  - Rodando uma instancia da imagem do Postges
 ```
        docker run --name arquivei-postgres --network=rtbortolin-arquivei-network -e "POSTGRES_PASSWORD=Postgres2019!" -p 5432:5432 -d postgres
```
 - Com o [PgAdmin](https://www.pgadmin.org/download/), crie um banco chamado `arquivei-test-db`

### Received NFe Viewer
- Entre na subpasta `received-nfe-viewer` e edite o arquivo `env.list` para apontar para o banco de dados criado no passo anterior.
- Rode os comandos do docker:
```
        docker build -t rtbortolin/arquivei-nfe-viewer .
```
```
        docker run --name arquivei-nfe-viewer --network=rtbortolin-arquivei-network --env-file ./env.list -p 49161:8080 -d rtbortolin/arquivei-nfe-viewer
```

### Received NFe Consumer
 - Entre na subpasta `received-nfe-consumer` e edite o arquivo `env.list` de acordo com as especificações da API da Arquivei.
    A chave `ARQUIVEI_VIEWER_API_URL` deve apontar para a url com o mesmo nome do container que foi definido para o container do Received NFe Viewer
 - Rode os comandos do docker:
```
        docker build -t rtbortolin/arquivei-consumer-app .
```
```
        docker run --name arquivei-consumer-app --network=rtbortolin-arquivei-network --env-file ./env.list -p 49160:3000 -d rtbortolin/arquivei-consumer-app
```

#### Acessando a aplicação

- Acesse a URL `http://localhost:49160/api/worker` e aguarde alguns segundos.
- Acesse a URL `htto://localhost:49161/api/nfe/{alguma chave existente na api da Arquivei}`


## Rodandos os testes
#### Received NFe Viewer
- Com o Java 8 ou superior configurado, entre na subpasta `received-nfe-viewer` e rode o comando:
```
    mvnw clean install
```

#### Received NFe Consumer
- Com NodeJS 10 ou superior instalado, entre na subpasta `received-nfe-consumer` e rode os comandos:
```
    npm install
```
```
    npm run test:tdd
```
- Para ver o relatório de cobertura do código:
```
    npm run test:coverage
```
