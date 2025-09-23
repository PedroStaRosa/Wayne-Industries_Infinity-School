from datetime import datetime
from flask_bcrypt import Bcrypt
from database import get_connection
bcrypt = Bcrypt()

# Criar usuário
def create_user(conn,name, email, password, role,id=None):
    cursor = conn.cursor()
    currentDate = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    if user:
        return None
    
    if id:
        cursor.execute("INSERT INTO users (id,name, email, password, role, is_active, created_at) VALUES (?,?, ?, ?,?, ?,?)",
                   (id,name, email, hashed_pw, role, True, currentDate))
    else:
        cursor.execute("INSERT INTO users (name, email, password, role, is_active, created_at) VALUES (?,?, ?, ?,?, ?)",
                   (name, email, hashed_pw, role, True, currentDate))
    
    return {
        "name": name,
        "email": email,
        "role": role,
        "created_at": currentDate,
        "updated_at": currentDate
    }

# Buscar usuário por ID - ok
def get_user_by_id(conn, id):
    
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (id,))
    row = cursor.fetchone()

    if row:
        return dict(row)
    return None
    
# Atualizar usuário
def update_user(conn, userId, newRole):
   
    cursor = conn.cursor()
    currentDate = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute("UPDATE users SET role = ?, updated_at = ? WHERE id = ?", (newRole, currentDate, userId))

    return {
        "id": userId,
        "role": newRole,
        "updated_at": currentDate
    } 

# Excluir usuario
def delete_user(conn, id):

    cursor = conn.cursor()
    currentDate = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    check_user = get_user_by_id(conn, id)
    if check_user['is_active'] == 0:
        return None
    
    cursor.execute("UPDATE users SET is_active = 0 , updated_at = ? WHERE id = ?", (currentDate,id))

    return {
        "id": id,
        "updated_at": currentDate
    }

    
# Listar usuários
def fetch_users(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE is_active = 1")
    rows = cursor.fetchall()
    users = []
    for row in rows:
        user_dict = dict(row)
        user_dict.pop("password", None)
        users.append(user_dict)

    return users

# Autenticar usuário - OK
def authenticate_user(conn, email, password):
    
    cursor = conn.cursor()
    print(email, password)
    cursor.execute("SELECT * FROM users WHERE email = ? AND is_active = 1", (email,))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user["password"], password):
        return dict(user)
    return None

# Listar recursos - OK
def get_resources(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resources")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

# Criar recurso - OK
def create_resource(conn, name, type, status):

    cursor = conn.cursor()
    currentDate = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("INSERT INTO resources (name, type, status, created_at) VALUES (?, ?, ?,?)",
                   (name, type, status,currentDate))

# Buscar recurso por ID - OK
def get_resource_by_id(conn,id):
    
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resources WHERE id = ?", (id,))
    row = cursor.fetchone()
    
    if row:
        return dict(row)
    return None

# Buscar recurso por ID - OK
def get_resource_by_name(conn,name):
    
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM resources WHERE name = ?", (name,))
    row = cursor.fetchone()
    
    if row:
        return dict(row)
    return None
 
# Excluir recurso - OK
def delete_resource(conn, id):
  
    cursor = conn.cursor()
    cursor.execute("DELETE FROM resources WHERE id = ?", (id,))

    
# Atualizar recurso - OK
def update_resource(conn, resource_id, name, type, status):
    cursor = conn.cursor()
    currentDate = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    get_resource = get_resource_by_id(conn,resource_id)
    if not get_resource:
        return None
    cursor.execute("UPDATE resources SET name = ?, type = ?, status = ?, updated_at = ? WHERE id = ?", (name, type, status, currentDate, resource_id))
    return {
        "id": resource_id,
        "name": name,
        "type": type,
        "status": status,
        "updated_at": currentDate
    } 
    
# Cria audit_logs
def new_audit_log(conn,user_id, action_description):
    
    cursor = conn.cursor()
    currentDate = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("INSERT INTO audit_logs (user_id, action_description, created_at) VALUES (?, ?, ?)",
                   (user_id, action_description, currentDate))
    
    
# Buscar Logs
def get_logs(limit=None):
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        SELECT a.id, a.action_description, a.created_at, u.name as user_created_action
        FROM audit_logs a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
    """
    
    if limit is not None:
        query += f" LIMIT {limit}"
    
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
    