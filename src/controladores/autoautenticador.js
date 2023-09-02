import { openDatabase, enablePromise, DEBUG } from "react-native-sqlite-storage"
import {Alert} from "react-native";
import auth from '@react-native-firebase/auth';

enablePromise(true);
DEBUG(true);

const abrirBancoDeDados = async ()=>{
    return openDatabase({name: "AssessorFinanceiro.db", location: "default"})
}
 
const criarTabela = async (bd)=>{
        const comandoCriaBD = "CREATE TABLE IF NOT EXISTS usuario(usuario varchar(255) not null PRIMARY key, senha varchar(255) not null);"
        bd.executeSql(comandoCriaBD)
        .then(()=>{alert("tabela criada com sucesso!!!")})
    }

const getUsuarioSenha = async ()=>{
        const query = "SELECT * FROM usuario;";
        
        return abrirBancoDeDados()
        .then(bd=>{
            return bd.executeSql(query)
            .then(d=>{
                if(d[0].rows.item(0)==undefined){return null;}
                return d[0].rows.item(0).senha;
            })
            .catch(e=>{
                return criarTabela(bd)
                .then(()=>{return null})
                .catch(()=>{Alert.alert("erro ao criar banco de dados local","não será possível salvar senhas")})
            })
        })
    }

export const salvarUsuarioSenha = async (usuario,senha)=>{
        const comandoInserirUsuarioSenha = "INSERT INTO usuario VALUES('"+usuario+"','"+senha+"')";

        return abrirBancoDeDados()
        .then(bd=>{
            bd.transaction(t=>{
                t.executeSql(comandoInserirUsuarioSenha)
                .then(()=>{
                    Alert.alert("SUCESSO","USUARIO E SENHA SALVA COM SUCESSO!")
                })
                .catch(e=>{
                    alert("ERRO!"+e)
                })
            })
            
        })
    }

export const autenticarAutomaticamente = async ()=>{
    let resultado = await getUsuarioSenha()
    if(resultado==null)return null;
    
    let usuarioSenha= await auth().signInWithEmailAndPassword("wesleynp@google.com",resultado);
    return usuarioSenha;
}