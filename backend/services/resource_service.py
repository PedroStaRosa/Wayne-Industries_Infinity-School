import models
from services.log_service import Log_Service
from database import get_connection
import logging
logger = logging.getLogger(__name__)

class Resource_service:
    def list_all_resources():
        try:
            conn = get_connection()
            all_resoucers = models.get_resources(conn)
            return {"resources": all_resoucers}, 200
        except Exception as e:
            logger.error(f"Erro ao buscar os recursos: {e}")
            return {"msg": "Erro ao buscar os recursos."}, 500
        finally:
            conn.close()
    
    def create_new_resource(name, type, status, actor_id):
        try:
            conn = get_connection()
            new_resource = models.create_resource(
                conn,
                name,
                type,
                status
            )
            
            Log_Service.create_new_log(conn,actor_id, f"Criou o recurso {name}")
            conn.commit()
            
            return {"msg": "Recurso criado com sucesso"}, 201
        except Exception as e:
            conn.rollback()  # desfaz o insert do recurso
            logger.error(f"Erro ao criar o recurso: {str(e)}")
            return {"error": f"Falha ao criar recurso"}, 500
        
        finally:
            conn.close()
    
    def update_resource(resource_id, name, type, status, actor_id):
        conn = None
        try:
            
            if name is None:
                return {"msg": "Nome do recurso invalido."}, 400
        
            if status is None:
                return {"msg": "Status do recurso invalido."}, 400
            
            if type is None:
                return {"msg": "Tipo do recurso invalido."}, 400
            
            conn = get_connection()
            
            resource_updated = models.update_resource(
                conn,
                resource_id,
                name,
                type,
                status
            )
            
            if resource_updated is None:
                return {"msg": "Recurso não encontrado."}, 400
            
            Log_Service.create_new_log(conn,actor_id, f"Atualizou o recurso {name}" )
            conn.commit()
            return {"msg": "Recurso atualizado com sucesso", "resource": resource_updated}, 200
        except Exception as e:
            if conn:
                conn.rollback() 
                
            logger.error(f"Erro ao atualizar o recurso: {str(e)}")
            return {"error": f"Falha ao atualizar recurso"}, 500
            
        finally:
            if conn:
                conn.close()
            
        
    
    def delete_resource(resource_id, actor_id):
        try:
            conn = get_connection()
            get_resource = models.get_resource_by_id(conn, resource_id)
    
            if not get_resource:
                return {"msg": "Recurso nao encontrado"}, 404
            
            if not get_resource['status'] == 'Inativo':
                return {"msg": "Recurso precisa esta inativo para ser deletado"}, 400

            delete_recurso = models.delete_resource(conn,resource_id)
            
            Log_Service.create_new_log(conn,actor_id, f"Removeu o recurso {get_resource['name']}"  )
            
            conn.commit()
            return {"msg": "Recurso deletado com sucesso"}, 200
            
        except Exception as e:
            conn.rollback()  # desfaz o insert do recurso
            logger.error(f"Erro ao deletar o recurso: {str(e)}")
            return {"error": f"Falha ao deletar recurso"}, 500
        
        finally:
            conn.close()
            
        