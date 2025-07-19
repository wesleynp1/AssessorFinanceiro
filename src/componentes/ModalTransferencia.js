import {useState} from "react";
import {View, Text, Button, Modal, StyleSheet, TouchableOpacity} from "react-native";
import {Picker} from '@react-native-picker/picker';
import CampoDinheiro from "./CampoDinheiro";

const ModalTransferencia = ({contas, tranferirEntreContas, fecharModal, visivel})=>{

    const [contaOrigem,setContaOrigem] = useState(contas[0].id);
    const [contaDestino,setContaDestino] = useState(contas[0].id);
    const [valor,setValor] = useState(0);

    let pickersContas = [];
    for(let i=0; i<contas.length;i++){
        pickersContas.push(
            <Picker.Item    
                label={contas[i].id}
                value={contas[i].id}
                key={i}
            />
        )
    }

    return(
        <Modal 
        animationType="fade"
        visible={visivel}
        transparent={true}
        onRequestClose={() =>{fecharModal(false)}}
        >
            <TouchableOpacity style={estilo.Modal} onPress={()=>{fecharModal(false)}}>
                <View style={estilo.Formulario}>
                    <Text style={estilo.Texto}>insira as informações</Text>

                    <Text>De:</Text>
                    <Picker 
                        onValueChange={c=>{setContaOrigem(c)}}
                        selectedValue={contaOrigem}
                        style={estilo.Picker}
                    >
                            {pickersContas}
                    </Picker>

                    <Text>Para:</Text>
                    <Picker 
                        onValueChange={c=>{setContaDestino(c)}}
                        selectedValue={contaDestino}
                        style={estilo.Picker}
                    >
                        {pickersContas}
                    </Picker>

                    <CampoDinheiro
                        aoMudarTexto={setValor}
                        valorInicial={valor}
                        estilo={estilo.CampoDinheiro}
                    />

                    <Button 
                        title="Transferir entre contas" 
                        onPress={()=>{tranferirEntreContas(contaOrigem,contaDestino,valor)}}
                    />

                    <Button 
                        title="Cancelar" 
                        color={"#AA0000"}
                        onPress={()=>{fecharModal(false)}}
                        />
                </View>
            </TouchableOpacity>
        </Modal>
        )
}

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
        fontSize: 15,
        color:"black",
        textAlign:'center'
    },
    Quadro: {  
        flex:1,
        backgroundColor: "#AAAACC",
        borderColor:"black",
        borderStyle:"solid",
        borderWidth:2,
    },
    Modal:{
        flex: 1,
        backgroundColor:'#2020207a',
    },
    Formulario: {
        maxHeight:300,
        maxWidth:300,
        margin: 'auto',
        backgroundColor: '#3b3b3bff',
        alignSelf: 'center'
    },
    CampoDinheiro: {
        backgroundColor: "gray", 
        alignSelf:'center',
        textAlign:'center',
        marginBottom: 4
    },
    Picker: {
        width:180,
        alignSelf:"center",
        backgroundColor:'#808000',
        marginBottom: 4
    }
});

export default ModalTransferencia;