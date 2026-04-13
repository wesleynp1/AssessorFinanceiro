import { useState, useEffect } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import conectorBancoDeDados from '../../controladores/conectorBancoDeDados';
import PaginaCarregando from "./PaginaCarregando";
import { dateParaTexto } from "../CampoData";
import { AreaTransacoes } from "./PaginaTransacoes"
import Transacao from "../Transacao";

function PaginaFatura(){
    const [carregando,setCarregando] = useState(true);
    const [faturas,setFaturas] = useState([]);
    useEffect(buscarDados,[])  

    //CRUD LANCAMENTO
    function novoLancamento(faturaId){
        let agora  = new Date();
        setCarregando(true)
        conectorBancoDeDados
        .inserirLancamento({categoria:"testandoCat",valor: (agora.getSeconds()*-17), data: agora},faturaId)
        .then(()=> buscarDados())
        .catch((erro)=>{Alert.alert("ERRO","Erro ao adicionar lancamento: "+erro)})
    }

    function deletarLancamento(id,faturaId){
        setCarregando(true)
        conectorBancoDeDados
        .deletarLancamento(id,faturaId)
        .then(()=> buscarDados())
        .catch((erro)=>{Alert.alert("ERRO","Erro ao deletar lancamento: "+erro)})
    }

    //CRUD FATURA
    function novaFatura(){
        conectorBancoDeDados.inserirFatura({dataPagamento: new Date(2028,8,10), contaPagamento:"Banco do Brasil", estaPaga: true})
        .then(()=>{
            setCarregando(true)
            Alert.alert("Sucesso!","Fatura criada com sucesso!")
            buscarDados();
        })
        .catch((erro)=>{Alert.alert("ERRO","Erro ao adicionar Fatura: "+erro)})
    }

    function deleteFatura(id){
        setCarregando(true)
        conectorBancoDeDados.deletarFatura(id)
        .then (()=>{buscarDados();})
        .catch((erro)=>{Alert.alert("ERRO","Erro ao Excluir lancamento: "+erro)});
    }

    function buscarDados(){
        conectorBancoDeDados
        .getFaturas()
        .then( faturas => {
            setFaturas(faturas);
            setCarregando(false);
        })
        .catch((e)=>{Alert.alert("ERRO","Erro ao buscar fatura:"+e)});

        return ()=>{};
    }

    if(carregando){      

        return <PaginaCarregando/>;

    }else{

        if(faturas.length > 0){
            return (
                <View style={estilo.principal}>
                    <Text style={{fontSize: 24, textAlign: "center", margin: 4}} >Faturas</Text>

                    <View >
                        <TouchableOpacity onPress={novaFatura} style={{backgroundColor: "red"}}>
                                <Text style={{fontSize: 20, textAlign: "center", margin: 10}}>Nova Fatura</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <SafeAreaView style={{backgroundColor: "blue",flex:1}}>
                        <Text style={{fontSize: 16, textAlign: "center"}}>resultados: {faturas.length}</Text>

                        <FlatList
                            data={faturas}
                            renderItem={(fatura) => 
                            <Fatura 
                                fatura={fatura.item} 
                                deleteFatura={deleteFatura} 
                                novoLancamento={novoLancamento}
                                deletarLancamento={deletarLancamento}
                                />
                            }
                        />
                    </SafeAreaView>
                </View>
            )  
        }
    }    
}

function Fatura({fatura, deleteFatura, novoLancamento, deletarLancamento}){
    const estilo = StyleSheet.create({
        fatura:{
            backgroundColor: "green",
            marginBottom: 32,  
            marginLeft:  4,          
            marginRight: 4,
        },
        cabeçalho:{
            flexDirection: "row-reverse",
            backgroundColor:"black",
            color:"white",
            marginBottom:10,
            padding:4,
            borderColor: "white",
            borderStyle: "solid",
            borderWidth: 1,
            marginRight: 3,
            marginLeft: 3
        },
        botao:{
            flex:1, 
            flexDirection:"column",
            justifyContent: "center",
            backgroundColor: "#c06d29",
            display:"flex"
        },
        botaoTexto:{
            fontSize: 20, 
            textAlign: "center", 
            margin: 10
        }
    }
    );    

    return (
        <View style={estilo.fatura}>
            <View style={estilo.cabeçalho}>
                <View>      
                    <TouchableOpacity onPress={()=>{deleteFatura(fatura.id)}} style={estilo.botao}>
                                    <Text style={estilo.botaoTexto}>X</Text>
                    </TouchableOpacity>          
                </View>    

                <View style={{flex:1}}>
                    <Text>conta:{fatura.contaPagamento}</Text>
                    <Text>Data pagamento:{dateParaTexto(fatura.dataPagamento)}</Text>
                    { fatura.estaPaga ? <Text>pago</Text> : <Text>Não Pago</Text>}
                </View>          
            </View>

            <View>      
                <TouchableOpacity onPress={()=>{novoLancamento(fatura.id)}} style={estilo.botao}>
                                <Text style={estilo.botaoTexto}>+</Text>
                </TouchableOpacity>          
            </View>

            <View>
                {fatura?.lancamentos && <AreaTransacoes titulo="Lançamentos" transacoes={fatura.lancamentos} excluirTransacao={lancamentoId => deletarLancamento(lancamentoId,fatura.id)} />}
            </View>
        </View>
    )
}

const estilo = StyleSheet.create({
    principal:{
        flex:1,
        display: "flex",        
        backgroundColor: "#4d2e2eff",
        },
    novaFatura:{
        flex: 1,
        padding: 12,                
        alignItems: "center",
        backgroundColor: "rgb(61, 168, 29)",
    },
    Subtitulo: {
        fontSize: 16,
        color: "white",
        textAlign: 'center'
    },
    AreaTransacoes:{
        flex: 1, 
        backgroundColor: "#221122" 
    }
});

export default PaginaFatura;