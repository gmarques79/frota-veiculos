# back/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from back.schemas import UsuarioResponse
from back.utils.security import verificar_senha
from back.utils.jwt import criar_token
from back.database import get_db
from back.models import Usuario
from back.schemas import LoginRequest

router = APIRouter()

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == login_data.email).first()
    if not usuario or not verificar_senha(login_data.senha, usuario.senha):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    token = criar_token({"sub": usuario.email})
    return {
        "access_token": token,
        "usuario": {
            "id": usuario.idusuario,
            "email": usuario.email,
            "nome": usuario.nome,
        }
    }