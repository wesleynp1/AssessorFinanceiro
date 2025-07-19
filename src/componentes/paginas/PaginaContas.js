import {useState} from "react";
import {View, Text, SafeAreaView, FlatList, StyleSheet, Button, Modal} from "react-native";
import {inteiroParaReal} from "../CampoDinheiro";
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
                <Text style={[estilo.Texto,{flex:1}]}>{item.id} </Text>
                <Text style={[estilo.Texto,{flex:1}]}>{inteiroParaReal(item.saldo)}</Text>
            </View>
        )
    }

    return(
        <View style={estilo.Pagina}>
            <Text style={estilo.Titulo}>CONTAS</Text>

            <SafeAreaView>
                <FlatList 
                data={contas} 
                renderItem={IniciaConta}
                />
            </SafeAreaView>

            <View style={{display: 'flex',flexDirection:'row'}}>                
                <View style={estilo.container}>
                    <Text style={estilo.Texto}>Saldo total</Text>
                    <Text style={estilo.Texto}>{inteiroParaReal(saldoTotal)}</Text>
                </View>

                <View style={estilo.container}>
                    <Text style={estilo.Texto}>Saldo por dia</Text>
                    <Text style={estilo.Texto}>
                        {inteiroParaReal(saldoDiaAteFimDoMes.toFixed(0))+"\n("+diasRestantesAteFimDoMes+" dias)"}
                    </Text>                    
                </View>
            </View>

            <Button title="Transferência entre contas" onPress={() =>{setModalVisivel(true);}} />

            <ModalTransferencia 
                visivel={modalVisivel}
                contas={contas} 
                tranferirEntreContas={tranferirEntreContas}
                fecharModal={setModalVisivel}
                />
        </View>
    );
}

export default PaginaContas;

let estilo = StyleSheet.create({
        Pagina:{
            flex:1,
            padding: 16,
            backgroundColor: '#333232ff'
        },
        Titulo:{
            fontSize: 24,
            color:"white",
            textAlign:'center'
        },  
        Texto:{
            fontSize: 28,
            color:"white"
        },
        Quadro: {  
            flex:1,
            margin:2,
            flexDirection: "row",
            justifyContent: 'space-between',
            backgroundColor: "#2c2c47ff",
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
        },
        container:{
            flex:1, 
            alignItems:'center',
            textAlign: 'center',
            backgroundColor: "#2c2c47ff",
            justifyContent:'center',
            borderColor:"black",
            borderStyle:"solid",
            borderWidth:2,
            marginVertical: 16
        }
    });