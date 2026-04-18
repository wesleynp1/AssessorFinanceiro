import React,{useState} from "react";
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import { CampoData2 } from "../CampoData";
import ContasPicker from "../ContasPicker";
import conectorBancoDeDados from '../../controladores/conectorBancoDeDados';


/**
 * 
 * @param {} param0 
 */
function PaginaPagarFatura({fatura, contas, buscarSaldoTransacoes}){

    const [data,setData] = useState(new Date());
    const [contaSelectionada,setContaSelectionada] = useState(contas[0]);
    const [carregando,setCarregando] = useState(false);

    function pagarFatura(){
        fatura.data = data;
        fatura.conta = contaSelectionada;

        Alert.alert("Pagar fatura",
                    "Deseja pagar esta fatura?",
                    [
                        {
                        text:"Cancelar"
                        },
                        {
                            text:"Pagar",
                            onPress: ()=> {
                                setCarregando(true)
                                conectorBancoDeDados.pagarFatura(fatura)
                                .then (()=>{
                                    buscarSaldoTransacoes();
                                })
                                .catch((erro)=>{
                                    Alert.alert("ERRO","Erro ao pagar fatura: "+erro);
                                    buscarSaldoTransacoes();
                                });
                            }
                        }
                    ]);
    }
    
    const estilo = StyleSheet.create({
        botao:{
            backgroundColor:"blue",
            alignItems: "center",
            padding: 10,
        }
    });

    if(carregando){
        return (
            <View style={{flex:1,backgroundColor:"#141313",justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontSize:32,color:"white"}}>Registrando Pagamento...</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Pagamento de Fatura</Text>

            <ContasPicker 
                contas={contas} 
                onValueChange={setContaSelectionada}
                contaSelecionada={contaSelectionada}
                />

            <CampoData2 
                aoMudarTexto={setData}
                valorInicial={data}
                />

            <TouchableOpacity style={estilo.botao} onPress={pagarFatura}>
                            <Text>REGISTRAR</Text>
            </TouchableOpacity>

        </View>
    )
}

export default PaginaPagarFatura;