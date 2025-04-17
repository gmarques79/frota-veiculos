from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from back import schemas, crud, database

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# Dependência
get_db = database.get_db

@router.post("/", summary="Criar usuário", response_model=schemas.UsuarioCreate)
def criar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = crud.get_usuario_by_email(db, email=usuario.email)
    if db_usuario:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    return crud.create_usuario(db=db, usuario_data=usuario)

@router.get("/", summary="Obter usuários", response_model=list[schemas.UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    return crud.get_usuarios(db)

@router.get("/{usuario_id}", summary="Obter usuário específico", response_model=schemas.UsuarioResponse)
def obter_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = crud.get_usuario(db, usuario_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario

@router.put("/{usuario_id}", summary="Atualizar usuário", response_model=schemas.UsuarioCreate)
def update_usuario(usuario_id: int, usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return crud.update_usuario(db, usuario_id, usuario)

@router.delete("/usuarios/{usuario_id}")
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return crud.delete_usuario(db, usuario_id)