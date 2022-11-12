import firestore from '@react-native-firebase/firestore';

//FAZ LIGAÇÃO COM O BANCO DE DADOS

const conectorBancoDeDados = 
{
    getContas: async ()=>{
        return await (await firestore().collection("usuarios").doc("wesleynp").collection("contas").doc("carteira").get()).data().saldo;
    },

    getSaldo: async ()=>{
        return await (await firestore().collection("usuarios").doc("wesleynp").collection("contas").doc("carteira").get()).data().saldo;
    },

    getTransacoes: async ()=>{
        return await firestore()
                    .collection("usuarios")
                    .doc("wesleynp")
                    .collection("transacoes")
                    .orderBy("data","desc")
                    .get().then(q => { 
                        return q.docs.map(r => {
                            t = r.data();
                            t.id= r.id;
                            return t;
                        })
                    });
    },

    inserirTransacao: async (t)=>{
        return await firestore().collection("usuarios").doc("wesleynp").collection("transacoes").add(t);
    },

    alterarinformacoes: (produtoAtualizado)=>{
        return new Promise(resolve =>{
            firestore().collection("produtos").doc(produtoAtualizado.id)
            .update({
                "nome":produtoAtualizado.nome,
                "loja":produtoAtualizado.loja,
                "preco":produtoAtualizado.preco,
                "data":produtoAtualizado.data,
                })
                .then(()=>resolve())
        })
    },

    excluirInformacoes: (id)=>{
        return firestore().collection("usuarios").doc("wesleynp").collection("transacoes").doc(id).delete();        
    }    
}

export default conectorBancoDeDados;