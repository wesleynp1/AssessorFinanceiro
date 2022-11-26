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
                            let t = r.data();
                            t.id= r.id;
                            t.data= r.data().data.toDate();
                            t.conta= r.data().conta._documentPath._parts[3]
                            return t;
                        })
                    });
    },

    inserirTransacao: async (t)=>{
        t.conta = firestore().doc("usuarios/wesleynp/contas/"+t.conta);
        console.log(t);

        return await firestore().collection("usuarios").doc("wesleynp").collection("transacoes").add(t);
    },

    atualizarTransacao: async (t)=>{
        return await firestore().collection("usuarios").doc("wesleynp").collection("transacoes").doc(t.id).update({
                "categoria":t.categoria,
                "data":t.data,
                "valor":t.valor,
                "conta":firestore().doc("usuarios/wesleynp/contas/"+t.conta),
                })
        
    },

    excluirTransacao: (id)=>{
        return firestore().collection("usuarios").doc("wesleynp").collection("transacoes").doc(id).delete();        
    }    
}

export default conectorBancoDeDados;