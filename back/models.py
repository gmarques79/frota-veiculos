from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from back.database import Base

class Usuario(Base):
    __tablename__ = "usuario"

    idusuario = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100))
    email = Column(String(100), unique=True)
    senha = Column(String(255))

class Motorista(Base):
    __tablename__ = "motorista"

    idmotorista = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100))
    cpf = Column(String(14), unique=True)
    cnh = Column(String(20), unique=True)
    telefone = Column(String(20))
    ativo = Column(Boolean, default=True)

class Veiculo(Base):
    __tablename__ = "veiculo"

    idveiculo = Column(Integer, primary_key=True, index=True)
    placa = Column(String(10), unique=True, nullable=False)
    modelo = Column(String(45))
    marca = Column(String(45))
    status = Column(Boolean, default=True)

class Saida(Base):
    __tablename__ = "saida"

    idsaida = Column(Integer, primary_key=True, index=True)
    id_veiculo = Column(Integer, ForeignKey("veiculo.idveiculo"), nullable=False)
    id_motorista = Column(Integer, ForeignKey("motorista.idmotorista"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuario.idusuario"), nullable=False)

    saida_prevista = Column(TIMESTAMP)
    chegada_prevista = Column(TIMESTAMP)
    saida_real = Column(TIMESTAMP)
    chegada_real = Column(TIMESTAMP)

    veiculo = relationship("Veiculo")  
    motorista = relationship("Motorista")  
    usuario = relationship("Usuario")  
