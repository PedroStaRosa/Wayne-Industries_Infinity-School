import models
from helper import is_protected_login
from flask_jwt_extended import create_access_token
from database import get_connection
from services.log_service import Log_Service
import logging
logger = logging.getLogger(__name__)


class User_Service:
    def login(email,password):
        try:
            conn = get_connection()
            user = models.authenticate_user(conn,email, password)
            if not user:
                return {"msg": "Credenciais inválidas"}, 401
            
            token = create_access_token(
                identity=str(user["id"]),
                additional_claims={
                    "role": user["role"],
                    "name": user["name"]
                }
            )
            return {"token": token, "role": user["role"], "name": user["name"]}, 201
        except Exception as e:
            logger.error(f"Erro ao logar: {str(e)}")
            return {"msg": "Erro interno ao tentar logar."}, 500
        finally:
            conn.close()
        
    
    def update_user(user_id, new_role, actor_id):
        conn = None
        try:
            # Validações de entrada
            if not user_id:
                return {"msg": "Usuário não encontrado."}, 400

            if not new_role:
                return {"msg": "Novo role não informado."}, 400

            if new_role not in ["admin", "manager", "employee"]:
                return {"msg": "Novo role inválido."}, 400
            if is_protected_login(user_id):
                return {"msg": "Este usuário não pode ser atualizado, pois tem login protegido."}, 403
            
            conn = get_connection()
            # Buscar usuário
            user = models.get_user_by_id(conn, user_id)
            if not user:
                return {"msg": "Usuário não encontrado."}, 404

            # Atualizar
            updated_user = models.update_user(conn,user_id, new_role)

            # Log de auditoria
            Log_Service.create_new_log(conn,actor_id, f"Atualizou o usuário {user['name']} para {new_role}")
            
            conn.commit()

            return {"msg": "Usuário atualizado com sucesso", "user": updated_user}, 200
        except Exception as e:
            if conn:
                conn.rollback()
                
            logger.error(f"Erro ao atualizar o usuário: {str(e)}")
            return {"error": "Falha ao atualizar usuário"}, 500
        
        finally:
            if conn:
                conn.close()
    
    def create_user( name, email, password, role, actor_id):
        conn= None
        try:
            
            if (not name) or (not email) or (not password) or (not role):
                return {"msg": "Todos os campos devem ser preenchidos."}, 400
            
            if role not in ["admin", "manager", "employee"]:
                return {"msg": "Role inválida."}, 400
            
            conn = get_connection()
            
            new_user = models.create_user(
            conn,
            name,
            email,
            password,
            role
            )
            if new_user is None:
                return {"msg": "Usuário já existe com esse email."}, 400
        
            Log_Service.create_new_log(conn,actor_id, f"Criou o novo usuário {name}")
            
            conn.commit()
            return {"msg": "Usuário criado com sucesso", "user": new_user}, 201
        except Exception as e:
            if conn:
                conn.rollback()
                
            logger.error(f"Erro ao atualizar o usuário: {str(e)}")
            return {"error": "Falha ao atualizar usuário"}, 500
        
        finally:
            if conn:
                conn.close()   
        
    
    def delete_user(user_id,actor_id):
        conn = None
        try:
            if is_protected_login(user_id):
                return {"msg": "Este usuario nao pode ser deletado, pois ele tem um login protegido."}, 403
    
            conn = get_connection()
            get_user = models.get_user_by_id(conn, user_id)
        
            if not get_user:
                return {"msg": "Usuário nao encontrado"}, 404
    
            delete_user = models.delete_user(conn, user_id)
            
            """ COMO O USUARIO NAO É DE FATO DELETADO E SIM ATUALIZADO COM O CAMPO IS_ACTIVE = 0, VALIDA-SE ESSE CAMPO PARA RETORNAR UM ERRO """
            if delete_user is None:
                return {"msg": "Usuário nao encontrado"}, 404

            Log_Service.create_new_log(conn,actor_id, f"Removeu o usuário {get_user['name']}")
            conn.commit()
            return {"msg": "Usuario deletado com sucesso"}, 200
        
        except Exception as e:
            if conn:
                conn.rollback()
                
            logger.error(f"Erro ao deletar o usuário: {str(e)}")
            return {"error": "Falha ao deletar usuário"}, 500
        
        finally:
            if conn:
                conn.close()
      
    
    def fetch_all_users():
        try:
            conn = get_connection()
            users = models.fetch_users(conn)
            
            return {"users": users}, 200
        
        except Exception as e:
            
            conn.rollback()
                
            logger.error(f"Erro ao buscar usuários: {str(e)}")
            return {"error": "Erro ao buscar usuários"}, 500
        
        finally:
           
            conn.close()

    