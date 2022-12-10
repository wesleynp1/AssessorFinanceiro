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
            })
        )}));
    },

    //CRUD TRANSAÇÕES
    getTransacoes: async ()=>{
        return await firestore()
                    .collection("usuarios")
                    .doc("wesleynp")
                    .collection("transacoes")
                    .orderBy("data","desc")
                    .get().then(q => { 
                        return q.docs.map(r => {
                            let t = r.data();
                            t.id= r.id;
                            t.data= r.data().data.toDate();
                            t.conta= r.data().conta._documentPath._parts[3]
                            return t;
                        })
                    });
    },

    inserirTransacao: async (t)=>{      

        return await firestore().runTransaction(async tr => {
            t.conta = firestore().doc("usuarios/wesleynp/contas/"+t.conta);

            //ADICIONA A TRANSAÇÃO
            await firestore()
            .collection("usuarios")
            .doc("wesleynp")
            .collection("transacoes")
            .add(t);
            
            const estadoAtualConta =  await tr.get(t.conta);

            tr.update(t.conta,{saldo: estadoAtualConta.data().saldo+t.valor})
        })
    },

    atualizarTransacao: async (t)=>{
        return await firestore().runTransaction(async tr =>{
            let referenciaTransacao = firestore().doc("usuarios/wesleynp/transacoes/"+t.id);
            let referenciaConta = firestore().doc("usuarios/wesleynp/contas/"+t.conta);

            let transacaoAtual = await tr.get(referenciaTransacao);

            if(transacaoAtual.data().valor!=t.valor)
            {
                let contaAtual = await tr.get(referenciaConta);
                let diferencaDeValor = transacaoAtual.data().valor-t.valor

                tr.update(referenciaConta,{saldo: contaAtual.data().saldo - diferencaDeValor})
            }

            tr.update(referenciaTransacao,{
                categoria: t.categoria,
                data: t.data,
                valor: t.valor,
                conta: referenciaConta
                })
            
        })

        /*return await firestore()
        .collection("usuarios")
        .doc("wesleynp")
        .collection("transacoes")
        .doc(t.id)
        .update({
                "categoria":t.categoria,
                "data":t.data,
                "valor":t.valor,
                "conta":firestore().doc("usuarios/wesleynp/contas/"+t.conta),
                })*/
        
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
    }    
}

export default conectorBancoDeDados;