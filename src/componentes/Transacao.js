import { View,Text, TouchableOpacity, Alert, StyleSheet } from "react-native"
import {inteiroParaReal} from "./CampoDinheiro"
import {dateParaTexto} from "./CampoData";

//EXIBE AS INFORMAÇÕES SOBRE A TRANSAÇÃO
const Transacao = ({transacao, excluirTransacao, editarTransacao})=>{

    let valorEmReal = inteiroParaReal(transacao.valor)

    const ConfirmarExcluirTransacao = ()=>{
            Alert.alert(
                "Exclusão de Transação",
                "Tem certeza que deseja excluir esta transação da categoria " + 
                transacao.categoria + "?",
                [
                    {
                        text:"Cancelar"
                    },
                    {
                        text:"Excluir",
                        onPress: ()=>{excluirTransacao(transacao.id)}
                    }
                ]
                );
        }

    return(
    <View style={{flex:1,backgroundColor:(transacao.valor<0 ? "red" :'green'), margin:8}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{fontSize:20}}>{transacao.categoria} </Text>
            <Text style={{fontSize:20}}>{transacao.conta} </Text>
            <Text style={{fontSize:20}}>{valorEmReal}</Text>            
        </View>
        
        <View style={{flexDirection:'row'}}>
                    <TouchableOpacity 
                        style={estilo.botaoExcluir} 
                        onPress={()=>{ConfirmarExcluirTransacao();}}
                    >
                        <Text style={{fontSize:15,color:"white"}}>EXCLUIR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={estilo.botaoEditar} 
                                      onPress={()=>{editarTransacao(transacao.id)}}>
                        <Text style={{fontSize:15,color:"black"}}>EDITAR</Text>
                    </TouchableOpacity>
                </View>
    </View>
    )
}

let estilo = StyleSheet.create({
    Texto:{
        fontSize: 15,
        color:"black",
    },
    Quadro: {  
        flex:1,
        margin:5,
        backgroundColor: "#CCCC00",
        borderColor:"black",
        borderStyle:"solid",
        borderWidth:2,
    },
    botaoExcluir:{
        flex:1, 
        backgroundColor:'#D50000',        
        alignItems:'center'
    },
    botaoEditar:{
        flex:1, 
        backgroundColor:'#00D500',
        alignItems:'center'
    }

    });

export default Transacao;