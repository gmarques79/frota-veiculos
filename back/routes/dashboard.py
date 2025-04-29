from fastapi import APIRouter, Depends
from back import database
from sqlalchemy.orm import Session
from back.models import Veiculo, Motorista
from back.schemas import EstatisticasResponse  

router = APIRouter(prefix="/statics", tags=["Estatísticas"])

get_db = database.get_db

@router.get("/", response_model=EstatisticasResponse)  
def estatisticas(db: Session = Depends(get_db)):
    carros_ativos = db.query(Veiculo).filter(Veiculo.status == True).count()
    carros_inativos = db.query(Veiculo).filter(Veiculo.status == False).count()

    motoristas_ativos = db.query(Motorista).filter(Motorista.ativo == True).count()
    motoristas_inativos = db.query(Motorista).filter(Motorista.ativo == False).count()

    return {
        "carros": {"ativos": carros_ativos, "inativos": carros_inativos},
        "motoristas": {"ativos": motoristas_ativos, "inativos": motoristas_inativos}
    }
