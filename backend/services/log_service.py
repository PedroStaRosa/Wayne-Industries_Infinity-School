import models

class Log_Service:
    def list_all_logs(limit=None):
        """ Valida se o limit é um número positivo """
        if limit is not None:
            try:
                limit = int(limit)
                if limit <= 0:
                    return {"error": "limit deve ser maior que 0"}, 400
            except ValueError:
                return {"error": "limit inválido"}, 400
        
        all_logs = models.get_logs(limit)

        return all_logs, 200
    
    def create_new_log(conn,actor_id, action_description):
        models.new_audit_log(conn,actor_id, action_description)
        return {"msg": "Log criado com sucesso"}
        