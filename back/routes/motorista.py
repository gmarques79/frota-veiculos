from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from back import schemas, crud, database
from back.models import Motorista

router = APIRouter(prefix="/motoristas", tags=["Motoristas"])

# Dependência de sessão com o banco de dados
get_db = database.get_db

@router.post("/", response_model=schemas.MotoristaResponse)
def criar_motorista(motorista: schemas.MotoristaCreate, db: Session = Depends(get_db)):
    # Verifica duplicidade de CPF ou CNH
    motorista_existente = db.query(Motorista).filter(
        (Motorista.cpf == motorista.cpf) | (Motorista.cnh == motorista.cnh)
    ).first()
    
    if motorista_existente:
        raise HTTPException(status_code=400, detail="Motorista com CPF ou CNH já cadastrado.")
    
    return crud.create_motorista(db, motorista)

@router.get("/", summary="Listar motoristas", response_model=list[schemas.MotoristaResponse])
def listar_motoristas(db: Session = Depends(get_db)):
    return crud.get_motoristas(db)

@router.get("/{motorista_id}", summary="Obter motorista específico", response_model=schemas.MotoristaResponse)
def obter_motorista(motorista_id: int, db: Session = Depends(get_db)):
    motorista = crud.get_motorista(db, motorista_id)
    if motorista is None:
        raise HTTPException(status_code=404, detail="Motorista não encontrado")
    return motorista

@router.put("/{motorista_id}", summary="Atualizar motorista", response_model=schemas.MotoristaResponse)
def atualizar_motorista(motorista_id: int, motorista: schemas.MotoristaCreate, db: Session = Depends(get_db)):
    return crud.update_motorista(db, motorista_id, motorista)

@router.delete("/{motorista_id}", summary="Deletar motorista")
def deletar_motorista(motorista_id: int, db: Session = Depends(get_db)):
    return crud.delete_motorista(db, motorista_id)
