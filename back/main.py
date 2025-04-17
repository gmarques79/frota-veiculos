from fastapi import FastAPI
from back.database import Base, engine
from back.routes import veiculo, motorista, saidas, usuario  # importando os routers

# Criação das tabelas no banco de dados (caso ainda não existam)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Controle de Frota")

# Registrando os routers
app.include_router(usuario.router)
app.include_router(motorista.router)
app.include_router(veiculo.router)
app.include_router(saidas.router)


@app.get("/")
def root():
    return {"message": "API online!"}
