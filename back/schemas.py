from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Schema para a criação de um usuário
class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

    class Config:
        # Usado para garantir que as variáveis são automaticamente convertidas para o formato correto
        orm_mode = True

# Schema para a resposta de um usuário (sem senha)
class UsuarioResponse(BaseModel):
    idusuario: int
    nome: str
    email: str

    class Config:
        orm_mode = True

# Schema para a criação de um motorista
class MotoristaCreate(BaseModel):
    nome: str
    cpf: str
    cnh: str
    telefone: str
    ativo: Optional[bool] = True  # Por padrão, o motorista está ativo

    class Config:
        orm_mode = True

# Schema para a resposta de um motorista
class MotoristaResponse(BaseModel):
    idmotorista: int
    nome: str
    cpf: str
    cnh: str
    telefone: str
    ativo: bool

    class Config:
        orm_mode = True

# Schema para a criação de um veículo
class VeiculoCreate(BaseModel):
    placa: str
    modelo: str
    marca: str
    status: Optional[bool] = True  # Por padrão, o veículo está ativo

    class Config:
        orm_mode = True

# Schema para a resposta de um veículo
class VeiculoResponse(BaseModel):
    idveiculo: int
    placa: str
    modelo: str
    marca: str
    status: bool

    class Config:
        orm_mode = True

# Schema para a criação de uma saída (registro de viagem)
class SaidaCreate(BaseModel):
    id_veiculo: int
    id_motorista: int
    id_usuario: int
    saida_prevista: datetime
    chegada_prevista: datetime
    saida_real: Optional[datetime] = None
    chegada_real: Optional[datetime] = None
    km_saida: Optional[str] = None
    km_chegada: Optional[str] = None

    class Config:
        orm_mode = True

# Schema para a resposta de uma saída (registro de viagem)
class SaidaResponse(BaseModel):
    idsaida: int
    veiculo: VeiculoResponse
    motorista: MotoristaResponse
    usuario: UsuarioResponse  
    saida_prevista: datetime
    chegada_prevista: datetime
    saida_real: Optional[datetime] = None
    chegada_real: Optional[datetime] = None
    km_saida: Optional[str] = None
    km_chegada: Optional[str] = None

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: str
    senha: str

    class Config:
        extra = "forbid"

class EstatisticasVeiculo(BaseModel):
    ativos: int
    inativos: int

class EstatisticasMotorista(BaseModel):
    ativos: int
    inativos: int

class EstatisticasResponse(BaseModel):
    carros: EstatisticasVeiculo
    motoristas: EstatisticasMotorista