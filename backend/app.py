from datetime import timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity
from database import init_db
import models
import os
import logging
from dotenv import load_dotenv
from helper import is_protected_login
from services.user_service import User_Service
from services.resource_service import Resource_service
from services.log_service import Log_Service
from flask_swagger_ui import get_swaggerui_blueprint 

load_dotenv()
SWAGGER_URL = "/docs"
API_URL = "/docs/openapi.yaml" 




app = Flask(__name__)

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={ "app_name": "Minha API" }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

@app.route("/docs/openapi.yaml")
def get_openapi():
    return send_from_directory("docs", "openapi.yaml")

logger = logging.getLogger(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 900))
)

jwt = JWTManager(app)

# Inicializar DB
init_db()



# Criar usuário admin inicial
try:
    models.create_user("Bruce Wayne", "bruce@wayne.com", "bruce123", "admin")
    models.create_user("Alfred", "alfred@wayne.com", "alfred123", "manager")
    models.create_user("Robin", "robin@wayne.com", "robin123", "employee")
except:
    pass 

""" ROTAS DE USUARIO """

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        response, status_code = User_Service.login(data.get("email"), data.get("password"))
        return jsonify(response), status_code
    
    except Exception as e:
        logger.error(f"Erro ao autenticar o usuário: {e}")
        return jsonify({"msg": "Erro ao autenticar o usuário."}), 500

@app.route("/createUser", methods=["POST"])
@jwt_required()
def add_user():
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role not in ["admin"]:
            return jsonify({"msg": "Acesso negado, você precisa ser um admin criar um novo usuário.", }), 403

        data = request.json
        response, status_code = User_Service.create_user(
            data.get("name"),
            data.get("email"),
            data.get("password"),
            data.get("role"),
            claims.get("sub")
        )

        return jsonify(response), status_code
    
    except Exception as e:
        logger.error(f"Erro ao criar o usuário: {e}")
        return jsonify({"msg": "Erro ao criar o usuário."}), 500

@app.route("/users", methods=["PUT"])
@jwt_required()
def update_user():
    try:
    
        claims = get_jwt()
        role = claims.get("role")
        if role not in ["admin"]:
            return jsonify({"msg": "Acesso negado, você precisa ser um admin para atualizar um usuário.", }), 403

        data = request.json
        response, status_code = User_Service.update_user(
            data.get("userId"),
            data.get("newRole"),
            claims.get("sub"))
            
        return jsonify(response), status_code
    
    except Exception as e:
        logger.error(f"Erro ao atualizar o usuário: {e}")
        return jsonify({"msg": "Erro ao atualizar o usuário."}), 500

@app.route("/users/<id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        
        if role not in ["admin"]:
            return jsonify({"msg": "Acesso negado, você precisa ser um admin para deletar um usuario."}), 403
    
        response, status_code = User_Service.delete_user(id, claims.get("sub"))

        return jsonify(response), status_code
    
    except Exception as e:
        logger.error(f"Erro ao deletar o usuário: {e}")
        return jsonify({"msg": "Erro ao deletar o usuário."}), 500
    

@app.route("/users/", methods=["GET"])
@jwt_required()
def fetch_user():
    try:
        claims = get_jwt()
        role = claims.get("role")
        
        if role not in ["admin" , "manager"]:
            return jsonify({"msg": "Acesso negado, você precisa ser um admin acessar esse recurso.", }), 403
    
        response, status_code = User_Service.fetch_all_users()
        
        return jsonify(response), status_code
    
    except Exception as e:
        logger.error(f"Erro ao buscar os usuários: {e}")
        return jsonify({"msg": "Erro ao buscar os usuários."}), 500


""" ROTAS DE RECURSOS """

@app.route("/resources", methods=["GET"])
@jwt_required()
def list_resources():
    try:
        response, status_code = Resource_service.list_all_resources()
        return jsonify(response), status_code
    except Exception as e:
        logger.error(f"Erro ao buscar os recursos: {e}")
        return jsonify({"msg": "Erro ao buscar os recursos."}), 500


@app.route("/resources/<id>", methods=["GET"])
@jwt_required()
def resource_by_id(id):
    try:
        resource = models.get_resource_by_id(id)
        if not resource:
            return jsonify({"msg": "Recurso não encontrado"}), 404
        
        return jsonify(resource), 200
    
    except Exception as e:
        logger.error(f"Erro ao buscar o recurso: {e}")
        return jsonify({"msg": "Erro ao buscar o recurso."}), 500

@app.route("/resources", methods=["POST"])
@jwt_required()
def add_resource():
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role not in ["admin", "manager"]:
            return jsonify({"msg": "Acesso negado, você precisa ser um admin ou manager para criar um novo recurso.", }), 403

        data = request.json
        response, status_code = Resource_service.create_new_resource(
            data["nameResource"],
            data["typeResource"],
            data["statusResource"],
            claims.get("sub"))

        return jsonify(response), status_code
    except Exception as e:
        logger.error(f"Erro ao criar o recurso: {e}")
        return jsonify({"msg": "Erro ao criar o recurso."}), 500

@app.route("/resources/<id>", methods=["PUT"])
@jwt_required()
def update_resource(id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role not in ["admin", "manager"]:
            return jsonify({"msg": "Acesso negado, você precisa ser um admin ou manager para atualizar um recurso.", }), 403

        data = request.json
        response, status_code = Resource_service.update_resource(
            id,
            data["name"],
            data["type"],
            data["status"],
            claims.get("sub")
        )
    
        return jsonify(response), status_code
    
    except Exception as e:
        logger.error(f"Erro ao atualizar o recurso: {e}")
        return jsonify({"msg": "Erro ao atualizar o recurso."}), 500

@app.route("/resources/<id>", methods=["DELETE"])
@jwt_required()
def delete_resource(id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role not in ["admin"]:
            return jsonify({"msg": "Acesso negado, você precisa ser um admin para deletar um recurso."}), 403

        response, status_code = Resource_service.delete_resource(id, claims.get("sub"))

        return jsonify(response), status_code
         
    except Exception as e:
        logger.error(f"Erro ao deletar o recurso: {e}")
        return jsonify({"msg": "Erro ao deletar o recurso."}), 500
     
#ROTAS DE LOG
@app.route("/logs", methods=["GET"])
@jwt_required()
def list_logs():
    try:
        limit = request.args.get("limit")
        
        response, status_code = Log_Service.list_all_logs(limit)
 
        return jsonify(response), status_code
    
    except Exception as e:
        logger.error(f"Erro ao buscar os logs: {e}")
        return jsonify({"msg": "Erro ao buscar os logs."}), 500
   
if __name__ == "__main__":
    """ app.run(debug=True) """
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(debug=debug)
