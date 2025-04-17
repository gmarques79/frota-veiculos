from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from back import schemas, crud, database
from back.models import Veiculo

router = APIRouter(prefix="/veiculos", tags=["Veículos"])

# Dependência de conexão com o banco de dados
get_db = database.get_db

@router.post("/", response_model=schemas.VeiculoResponse)
def criar_veiculo(veiculo: schemas.VeiculoCreate, db: Session = Depends(get_db)):
    # Verifica se a placa já está cadastrada
    veiculo_existente = db.query(Veiculo).filter(Veiculo.placa == veiculo.placa).first()

    if veiculo_existente:
        raise HTTPException(status_code=400, detail="Veículo com esta placa já cadastrado.")

    return crud.create_veiculo(db, veiculo)

@router.get("/", summary="Listar veículos", response_model=list[schemas.VeiculoResponse])
def listar_veiculos(db: Session = Depends(get_db)):
    return crud.get_veiculos(db)

@router.get("/{veiculo_id}", summary="Obter veículo específico", response_model=schemas.VeiculoResponse)
def obter_veiculo(veiculo_id: int, db: Session = Depends(get_db)):
    veiculo = crud.get_veiculo(db, veiculo_id)
    if veiculo is None:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return veiculo

@router.put("/{veiculo_id}", summary="Atualizar veículo", response_model=schemas.VeiculoResponse)
def atualizar_veiculo(veiculo_id: int, veiculo: schemas.VeiculoCreate, db: Session = Depends(get_db)):
    return crud.update_veiculo(db, veiculo_id, veiculo)

@router.delete("/{veiculo_id}", summary="Deletar veículo")
def deletar_veiculo(veiculo_id: int, db: Session = Depends(get_db)):
    return crud.delete_veiculo(db, veiculo_id)
