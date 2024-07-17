import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

//FAZ LIGAÇÃO COM O BANCO DE DADOS

const usuario = "wesleynp"

const conectorBancoDeDados = 
{
    getContas: async ()=>{
        return await (
            await firestore()
            .collection("usuarios")
            .doc(usuario)
            .collection("contas")
            .get()
            .then(q => {
                
                console.log("Os dados foram pegos! resultado:" + q.size)

                return(q.docs.map(c=>{
                    let contas = c.data();
                    contas.id = c.id;
                    return contas
                }))
            })
            .catch(e=>{Alert.alert("Erro","Erro de leitura dos dados:"+e)})
        );
    },    

    transferirEntreContas: async (contaDeOrigem,contaDeDestino, valor)=>{
        return await firestore().runTransaction(async t => {
            
            let refContaDeOrigem  = firestore().doc("usuarios/"+usuario+"/contas/"+contaDeOrigem);
            let refContaDeDestino = firestore().doc("usuarios/"+usuario+"/contas/"+contaDeDestino);

            let docContaDeOrigem =  await t.get(refContaDeOrigem);
            let docContaDeDestino = await t.get(refContaDeDestino);

            let dadosContaDeOrigem =  docContaDeOrigem.data();
            let dadosContaDeDestino = docContaDeDestino.data();

            console.log("dadosContaDeOrigem:  "+dadosContaDeDestino);
            console.log("dadosContaDeDestino: "+dadosContaDeOrigem);

            t.update(refContaDeOrigem,{saldo: dadosContaDeOrigem.saldo-valor});
            t.update(refContaDeDestino,{saldo: dadosContaDeDestino.saldo+valor}); 
        })
        .then(()=>{Alert.alert("Sucesso!","Transferência entre contas realizada com sucesso!")})
        .catch(e=>{Alert.alert("Erro","Erro na transferência entre contas"+e)})
    },

    //CRUD TRANSAÇÕES
    getTransacoes: async (ano)=>{
        return await firestore()
                    .collection("usuarios")
                    .doc(usuario)
                    .collection("transacoes")
                    .orderBy("data","desc")
                    .where("data",">=",new Date(ano+'-01-01'))
                    .where("data","<",new Date((ano+1)+'-01-01'))
                    .get()
                    .then(q => { 
                        return q.docs.map(r => {
                            let t = r.data();
                            t.id= r.id;
                            t.data= r.data().data.toDate();
                            t.conta= r.data().conta._documentPath._parts[3]
                            return t;
                        })
                    })
                    .catch(e=>{Alert.alert("Erro","Erro de leitura dos dados"+e)});
    },

    inserirTransacao: async (t)=>{

        return await firestore().runTransaction(async tr => {
            t.conta = firestore().doc("usuarios/"+usuario+"/contas/"+t.conta);
            let TransacaoRef = firestore().collection("usuarios/"+usuario+"/transacoes").doc();
            await tr.set(TransacaoRef,t);            
            const estadoAtualConta =  await tr.get(t.conta);
            tr.update(t.conta,{saldo: estadoAtualConta.data().saldo+t.valor})
        })
        .then(()=>{Alert.alert("Sucesso!","Transação adicionada com sucesso!")})
        .catch(()=>{Alert.alert("ERRO","Erro ao adicionar transacao")})
    },

    atualizarTransacao: async (t)=>{
        t.conta = firestore().doc("usuarios/"+usuario+"/contas/"+t.conta);

        return await firestore().runTransaction(async tr =>{
            //LEITURAS
            let referenciaTransacao = firestore().doc("usuarios/"+usuario+"/transacoes/"+t.id);
            let transacaoAtual = await tr.get(referenciaTransacao);
            let dadosTransacaoAtual = transacaoAtual.data();
                        
            if(dadosTransacaoAtual.conta.path==t.conta.path)
            {
                if(dadosTransacaoAtual.valor==t.valor){
                    tr.update(referenciaTransacao,{
                        categoria: t.categoria,
                        data: t.data
                        });
                }else{
                    let conta = await tr.get(t.conta);

                    tr.update(t.conta,{saldo: (conta.data().saldo-dadosTransacaoAtual.valor+t.valor)})
                    tr.update(referenciaTransacao,{
                        categoria: t.categoria,
                        data: t.data,
                        valor: t.valor
                        });
                }
            }else{
                let contaAntiga = await tr.get(dadosTransacaoAtual.conta);
                let contaNova = await tr.get(t.conta);

                let dadosContaAntiga = contaAntiga.data();
                let dadosContaNova = contaNova.data();

                tr.update(dadosTransacaoAtual.conta,{saldo: dadosContaAntiga.saldo-dadosTransacaoAtual.valor})
                tr.update(t.conta,{saldo: dadosContaNova.saldo+t.valor})

                tr.update(referenciaTransacao,{
                    categoria: t.categoria,
                    data: t.data,
                    valor: t.valor,
                    conta: t.conta
                    });
            }           
        })
        .then(()=>{Alert.alert("Sucesso!","Transação atualizada com sucesso!")})
        .catch(e=>{Alert.alert("Erro","Erro ao atualizar a transacao:"+e)})
        
    },

    excluirTransacao: async (id)=>{
        return await firestore().runTransaction(async tr =>{
            //FASE DE LEITURA
            let referenciaTransacaoParaExcluir = firestore().doc("usuarios/"+usuario+"/transacoes/"+id);
            let transacaoParaExluir = await tr.get(referenciaTransacaoParaExcluir);

            let referenciaConta = transacaoParaExluir.data().conta;
            let conta = await tr.get(referenciaConta);

            //FASE DE ESCRITA
            tr.update(referenciaConta,{saldo: conta.data().saldo-transacaoParaExluir.data().valor})
            tr.delete(referenciaTransacaoParaExcluir);
        })
        .then(()=>{Alert.alert("Sucesso!","Transação excluida com sucesso!")})
        .catch(e=>{Alert.alert("Erro","Erro ao excluir a transacao\nmotivo:"+e)})
    }    
}

export default conectorBancoDeDados;