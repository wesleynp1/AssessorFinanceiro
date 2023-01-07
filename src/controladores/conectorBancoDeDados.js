import firestore from '@react-native-firebase/firestore';

//FAZ LIGAÇÃO COM O BANCO DE DADOS

const conectorBancoDeDados = 
{
    getContas: async ()=>{
        return await (await firestore().collection("usuarios").doc("wesleynp").collection("contas").get()
            .then(q => {
                return(q.docs.map(c=>{
                    let contas = c.data();
                    contas.id = c.id;
                    return contas
                }))
            })
            .catch(e=>{alert("Erro de leitura dos dados:"+e)})
        );
    },

    //CRUD TRANSAÇÕES
    getTransacoes: async ()=>{
        return await firestore()
                    .collection("usuarios")
                    .doc("wesleynp")
                    .collection("transacoes")
                    .orderBy("data","desc")
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
                    .catch(e=>{alert("Erro de leitura dos dados"+e)});
    },

    inserirTransacao: async (t)=>{

        return await firestore().runTransaction(async tr => {
            t.conta = firestore().doc("usuarios/wesleynp/contas/"+t.conta);
            let TransacaoRef = firestore().collection("usuarios/wesleynp/transacoes").doc();
            await tr.set(TransacaoRef,t);            
            const estadoAtualConta =  await tr.get(t.conta);
            tr.update(t.conta,{saldo: estadoAtualConta.data().saldo+t.valor})
        })
        .then(()=>{alert("Transação adicionada com sucesso!")})
        .catch(()=>{alert("Erro ao adicionar transacao")})
    },

    atualizarTransacao: async (t)=>{
        return await firestore().runTransaction(async tr =>{
            //LEITURAS
            let referenciaTransacao = firestore().doc("usuarios/wesleynp/transacoes/"+t.id);
            let referenciaNovaConta = firestore().doc("usuarios/wesleynp/contas/"+t.conta);
            
            let transacaoAtual = await tr.get(referenciaTransacao);
            let referenciaContaAntiga = transacaoAtual.data().conta;
            let contaAntiga = await tr.get(referenciaContaAntiga);
            let contaNova = await tr.get(referenciaNovaConta);

            //ESCRITAS
            tr.update(
                referenciaContaAntiga,{
                saldo: contaAntiga.data().saldo - transacaoAtual.data().valor});

            tr.update(referenciaNovaConta,{
                saldo: contaNova.data().saldo + t.valor})

            tr.update(referenciaTransacao,{
                categoria: t.categoria,
                data: t.data,
                valor: t.valor,
                conta: referenciaNovaConta
                })
            
        })
        .then(()=>{alert("Transação atualizada com sucesso!")})
        .catch(()=>{alert("Erro ao atualizar a transacao")})
        
    },

    excluirTransacao: async (id)=>{
        return await firestore().runTransaction(async tr =>{

            //FASE DE LEITURA
            let referenciaTransacaoParaExcluir = firestore().doc("usuarios/wesleynp/transacoes/"+id);
            let transacaoParaExluir = await tr.get(referenciaTransacaoParaExcluir);

            let referenciaConta = transacaoParaExluir.data().conta;
            let conta = await tr.get(referenciaConta);

            //FASE DE ESCRITA
            tr.update(referenciaConta,{saldo: conta.data().saldo-transacaoParaExluir.data().valor})
            tr.delete(referenciaTransacaoParaExcluir);
        })
        .then(()=>{alert("Transação excluida com sucesso!")})
        .catch(()=>{alert("Erro ao excluir a transacao")})
    }    
}

export default conectorBancoDeDados;