from fastapi import FastAPI
from back.database import Base, engine
from back.routes import veiculo, motorista, saidas, usuario, auth  
from fastapi.middleware.cors import CORSMiddleware


# Criação das tabelas no banco de dados (caso ainda não existam)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Controle de Frota")

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ou ["*"] para permitir todos (não recomendado em produção)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrando os routers
app.include_router(usuario.router)
app.include_router(motorista.router)
app.include_router(veiculo.router)
app.include_router(saidas.router)
app.include_router(auth.router)


@app.get("/")
def root():
    return {"message": "API online!"}
