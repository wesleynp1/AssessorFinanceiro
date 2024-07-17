import {useState} from "react";
import {View, Text, SafeAreaView, FlatList, StyleSheet, Button, Modal} from "react-native";
import {inteiroParaReal} from "../CampoDinheiro";
import {Picker} from '@react-native-picker/picker';
import CampoDinheiro from "../CampoDinheiro";
import ModalTransferencia from "../ModalTransferencia";

const PaginaContas = ({contas, tranferirEntreContas})=>{

    const [modalVisivel,setModalVisivel] = useState(false);

    let saldoTotal = 0
    contas.forEach(c =>{saldoTotal+=c.saldo});

    let hoje = new Date();
    let ultimoDiaDesteMes = new Date(hoje.getFullYear(),hoje.getMonth()+1,0);
    let diasRestantesAteFimDoMes = ultimoDiaDesteMes.getDate()-hoje.getDate();
    let saldoDiaAteFimDoMes = saldoTotal/diasRestantesAteFimDoMes;

    let IniciaConta =  ({item}) => {
        return(
            <View style={estilo.Quadro}>
                <Text style={estilo.Texto}>
                    {item.id} {"\n"}
                    saldo: {inteiroParaReal(item.saldo)}
                </Text>
            </View>
        )
    }

    return(
        <View style={estilo.Pagina}>

            <ModalTransferencia 
                visivel={modalVisivel}
                contas={contas} 
                tranferirEntreContas={tranferirEntreContas}
                fecharModal={setModalVisivel}
                />

            <Text style={estilo.Titulo}>CONTAS</Text>

            <SafeAreaView>
                <FlatList 
                data={contas} 
                renderItem={IniciaConta}
                />
            </SafeAreaView>


            <Text style={estilo.Texto}> Saldo total: {inteiroParaReal(saldoTotal)}</Text>
            <Text style={estilo.Texto}>
            saldo diário até o fim do mês: {"\n"}
            {inteiroParaReal(saldoDiaAteFimDoMes.toFixed(0))+"("+diasRestantesAteFimDoMes+" dias)"}
            </Text>

            <Button title="Transferência entre contas" onPress={() =>{setModalVisivel(true);}} />
        </View>
    );
}

export default PaginaContas;

let estilo = StyleSheet.create({
        Pagina:{
            padding: 16
        },
        Titulo:{
            fontSize: 24,
            color:"black",
            textAlign:'center'
        },  
        Texto:{
            fontSize: 32,
            color:"black",
            textAlign:'center'
        },
        Quadro: {  
            flex:1,
            margin:5,
            backgroundColor: "#AAAACC",
            borderColor:"black",
            borderStyle:"solid",
            borderWidth:2,            
        },
        CampoDinheiro: {
            backgroundColor: "gray", 
            width: 128, 
            alignSelf:'center',
            textAlign:'center'
        },
        Picker: {
            width:180,
            alignSelf:"center",
            backgroundColor:'#808000'
        }
    });