from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from back import schemas, crud, database
from back.models import Veiculo, Motorista, Usuario

router = APIRouter(prefix="/saidas", tags=["Saídas"])

# Dependência
get_db = database.get_db

@router.post("/", response_model=schemas.SaidaResponse)
def criar_saida(saida: schemas.SaidaCreate, db: Session = Depends(get_db)):
    # Verificações básicas de integridade referencial
    veiculo = db.query(Veiculo).filter(Veiculo.idveiculo == saida.id_veiculo).first()
    motorista = db.query(Motorista).filter(Motorista.idmotorista == saida.id_motorista).first()
    usuario = db.query(Usuario).filter(Usuario.idusuario == saida.id_usuario).first()

    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado.")
    if not motorista:
        raise HTTPException(status_code=404, detail="Motorista não encontrado.")
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    return crud.create_saida(db, saida)

@router.get("/", summary="Listar saídas", response_model=list[schemas.SaidaResponse])
def listar_saidas(db: Session = Depends(get_db)):
    return crud.get_saidas(db)

@router.get("/{saida_id}", summary="Obter saída específica", response_model=schemas.SaidaResponse)
def obter_saida(saida_id: int, db: Session = Depends(get_db)):
    saida = crud.get_saida(db, saida_id)
    if saida is None:
        raise HTTPException(status_code=404, detail="Saída não encontrada")
    return saida

@router.put("/{saida_id}", summary="Atualizar saída", response_model=schemas.SaidaResponse)
def atualizar_saida(saida_id: int, saida: schemas.SaidaCreate, db: Session = Depends(get_db)):
    return crud.update_saida(db, saida_id, saida)

@router.delete("/{saida_id}", summary="Deletar saída")
def deletar_saida(saida_id: int, db: Session = Depends(get_db)):
    return crud.delete_saida(db, saida_id)
