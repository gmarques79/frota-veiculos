from sqlalchemy.orm import Session
from back.models import Usuario, Motorista,  Veiculo, Saida
from back.schemas import * 
from .utils.security import hash_senha


# CRUD de Usuário
def create_usuario(db: Session, usuario_data: UsuarioCreate):
    hashed = hash_senha(usuario_data.senha)
    usuario = Usuario(
        nome=usuario_data.nome,
        email=usuario_data.email,
        senha=hashed
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

def get_usuario(db: Session, usuario_id: int):
    return db.query(Usuario).filter(Usuario.idusuario == usuario_id).first()

def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Usuario).offset(skip).limit(limit).all()

def get_usuario_by_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()

def update_usuario(db: Session, usuario_id: int, usuario_data: UsuarioCreate):
    usuario = db.query(Usuario).filter(Usuario.idusuario == usuario_id).first()
    if usuario:
        # Atualizando os dados com o schema
        usuario.nome = usuario_data.nome
        usuario.email = usuario_data.email
        usuario.senha = usuario_data.senha
        db.commit()
        db.refresh(usuario)
    return usuario

def delete_usuario(db: Session, usuario_id: int):
    usuario = db.query(Usuario).filter(Usuario.idusuario == usuario_id).first()
    if usuario:
        db.delete(usuario)
        db.commit()
    return usuario

# CRUD de Motorista

def create_motorista(db: Session, motorista_data: MotoristaCreate):
    motorista = Motorista(**motorista_data.dict())  # Usando o schema para transformar dados
    db.add(motorista)
    db.commit()
    db.refresh(motorista)
    return motorista

def get_motorista(db: Session, motorista_id: int):
    return db.query(Motorista).filter(Motorista.idmotorista == motorista_id).first()

def get_motoristas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Motorista).offset(skip).limit(limit).all()

def update_motorista(db: Session, motorista_id: int, motorista_data: MotoristaCreate):
    motorista = db.query(Motorista).filter(Motorista.idmotorista == motorista_id).first()
    if motorista:
        motorista.nome = motorista_data.nome
        motorista.cpf = motorista_data.cpf
        motorista.cnh = motorista_data.cnh
        motorista.telefone = motorista_data.telefone
        motorista.ativo = motorista_data.ativo
        db.commit()
        db.refresh(motorista)
    return motorista

def delete_motorista(db: Session, motorista_id: int):
    motorista = db.query(Motorista).filter(Motorista.idmotorista == motorista_id).first()
    if motorista:
        db.delete(motorista)
        db.commit()
    return motorista

# CRUD de Veiculo

def create_veiculo(db: Session, veiculo_data: VeiculoCreate):
    veiculo = Veiculo(**veiculo_data.dict())  # Usando o schema para transformar dados
    db.add(veiculo)
    db.commit()
    db.refresh(veiculo)
    return veiculo

def get_veiculo(db: Session, veiculo_id: int):
    return db.query(Veiculo).filter(Veiculo.idveiculo == veiculo_id).first()

def get_veiculos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Veiculo).offset(skip).limit(limit).all()

def update_veiculo(db: Session, veiculo_id: int, veiculo_data: VeiculoCreate):
    veiculo = db.query(Veiculo).filter(Veiculo.idveiculo == veiculo_id).first()
    if veiculo:
        veiculo.placa = veiculo_data.placa
        veiculo.modelo = veiculo_data.modelo
        veiculo.marca = veiculo_data.marca
        veiculo.status = veiculo_data.status
        db.commit()
        db.refresh(veiculo)
    return veiculo

def delete_veiculo(db: Session, veiculo_id: int):
    veiculo = db.query(Veiculo).filter(Veiculo.idveiculo == veiculo_id).first()
    if veiculo:
        db.delete(veiculo)
        db.commit()
    return veiculo

# CRUD de Saida

def create_saida(db: Session, saida_data: SaidaCreate):
    saida = Saida(**saida_data.dict())  # Usando o schema para transformar dados
    db.add(saida)
    db.commit()
    db.refresh(saida)
    return saida

def get_saida(db: Session, saida_id: int):
    return db.query(Saida).filter(Saida.idsaida == saida_id).first()

def get_saidas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Saida).offset(skip).limit(limit).all()

def update_saida(db: Session, saida_id: int, saida_data: SaidaCreate):
    saida = db.query(Saida).filter(Saida.idsaida == saida_id).first()
    if saida:
        saida.id_veiculo = saida_data.id_veiculo
        saida.id_motorista = saida_data.id_motorista
        saida.id_usuario = saida_data.id_usuario
        saida.saida_prevista = saida_data.saida_prevista
        saida.chegada_prevista = saida_data.chegada_prevista
        saida.saida_real = saida_data.saida_real
        saida.chegada_real = saida_data.chegada_real
        db.commit()
        db.refresh(saida)
    return saida

def delete_saida(db: Session, saida_id: int):
    saida = db.query(Saida).filter(Saida.idsaida == saida_id).first()
    if saida:
        db.delete(saida)
        db.commit()
    return saida