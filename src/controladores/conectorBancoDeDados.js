import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

//FAZ LIGAÇÃO COM O BANCO DE DADOS

const usuario = "teste"

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
        let erroValor = valor == 0;
        let erroBancos = contaDeOrigem == contaDeDestino;

        if (erroValor || erroBancos){
            throw new Error(
                "parametros incorretos:\n"+ 
                (erroValor  ? "Valor não pode ser 0\n" : "")+
                (erroBancos ? "Os bancos não pode ser iguais" : "")
            );
        }

        return await firestore().runTransaction(async t => {
            
            let refContaDeOrigem  = firestore().doc("usuarios/"+usuario+"/contas/"+contaDeOrigem);
            let refContaDeDestino = firestore().doc("usuarios/"+usuario+"/contas/"+contaDeDestino);

            let docContaDeOrigem =  await t.get(refContaDeOrigem);
            let docContaDeDestino = await t.get(refContaDeDestino);

            let dadosContaDeOrigem =  docContaDeOrigem.data();
            let dadosContaDeDestino = docContaDeDestino.data();

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
            tr.set(TransacaoRef,t);            
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
    },

    //CRUD FATURAS
    inserirFatura: async (novaFatura)=>{     
        novaFatura.criadoEm = new Date();
        firestore().collection("usuarios/"+usuario+"/faturas").add(novaFatura);       
    },
    getFaturas: async ()=>{
        let faturas = firestore()
        .collection("usuarios/"+usuario+"/faturas")
        .orderBy("criadoEm","desc")
        .get()
        .then( query => {
                return query.docs.map( doc => {                    
                        let fatura = doc.data(); 
                        fatura.id = doc.id;
                        fatura.dataPagamento  = (fatura.dataPagamento ? fatura.dataPagamento.toDate() : null);
                        fatura.contaPagamento = (fatura.contaPagamento ? fatura.contaPagamento._documentPath._parts[3] : null);
                        fatura.lancamentos = [];
                        return fatura;
                    });
            }
        )
        .then( async faturas => {

            for(let fatura of faturas){
                let lancamentos = (await firestore().collection("usuarios/"+usuario+"/faturas/"+fatura.id+"/lancamentos").orderBy("data","desc").get()).docs;

                for(let lancamento of lancamentos){
                    let id = lancamento.id
                    lancamento = lancamento.data();
                    lancamento.id = id;
                    lancamento.data = lancamento.data.toDate();

                    fatura.lancamentos.push(lancamento);
                }                
            };

            return faturas;
        })
        .catch(erro => alert("erro ao buscar faturas:"+erro));        

        return faturas;
    },
    deletarFatura: async (id)=>{
        firestore().doc("usuarios/"+usuario+"/faturas/"+id).delete();
    },
    
    //CRUD LANÇAMENTOS
    inserirLancamento: (novoLancamento,faturaId)=>{
        return firestore().collection("usuarios/"+usuario+"/faturas/"+faturaId+"/lancamentos").add(novoLancamento);
    },
    deletarLancamento: (id,faturaId)=>{
        return firestore().doc("usuarios/"+usuario+"/faturas/"+faturaId+"/lancamentos/"+id).delete()
    },
    editarLancamento(lancamentoEditado,faturaId){
        return firestore().doc("usuarios/"+usuario+"/faturas/"+faturaId+"/lancamentos/"+lancamentoEditado.id).update(lancamentoEditado)
    },
    //PAGAMENTO DE FATURA E REVERSÃO
    pagarFatura(fatura){
        try{               
            fatura.conta = firestore().doc("usuarios/"+usuario+"/contas/"+fatura.conta);        
            fatura.lancamentos = fatura.lancamentos.map(l => {
                        l.conta = fatura.conta;
                        l.data = fatura.data;
                        return l;
                    });

            return firestore().runTransaction(async tr =>{    
                
                    let saldo = (await tr.get(fatura.conta)).data().saldo;
                    
                    for(lancamento of fatura.lancamentos){
                        saldo += lancamento.valor;
                        tr.set(firestore().collection("usuarios/"+usuario+"/transacoes").doc(), lancamento);
                    }                

                    tr.update(fatura.conta,{saldo: saldo});
                    tr.update(firestore().doc("usuarios/"+usuario+"/faturas/"+fatura.id) ,{estaPaga: true, conta: fatura.conta, dataPagamento: fatura.data})                
            });
        }catch(e){
                alert("Erro:"+e);
            }
    }
}

export default conectorBancoDeDados;