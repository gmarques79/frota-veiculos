import socket

# IP direto (bypass DNS)
host = "2600:1f16:1cd0:3303:bbaf:ceed:ff61:25d0"
port = 5432

try:
    s = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
    s.settimeout(5)
    s.connect((host, port))
    print("✅ Conexão bem-sucedida!")
except Exception as e:
    print("❌ Falha na conexão:", e)
finally:
    s.close()
