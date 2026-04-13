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
        onRequestClose={fecharModal}
        >
            <View style={estilo.Modal}>
                <Text style={estilo.BotaoFechar} onPress={fecharModal}>X</Text>
                <View style={estilo.Formulario}>
                    <Text style={estilo.Titulo}>Insira as informações</Text>

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
                    
                    <TouchableOpacity style={estilo.BotaoTransferir} onPress={()=>{tranferirEntreContas(contaOrigem,contaDestino,valor)}}>
                        <Text>TRANSFERIR</Text>
                    </TouchableOpacity>

                    <Button 
                        title="Cancelar" 
                        color={"#AA0000"}
                        onPress={fecharModal}
                        />
                </View>
            </View>
        </Modal>
        )
}

let estilo = StyleSheet.create({
    Titulo:{
        fontSize: 24,        
        textAlign:'center',
        marginBottom: 16
    },
    Modal:{
        flex: 1,
        backgroundColor:'#000000b4',
        justifyContent: "center"
    },
    Formulario: {
        backgroundColor: 'rgba(59, 59, 59, 0.96)',
        alignSelf: 'center',
        paddingLeft: 32,
        paddingRight: 32,
        paddingBottom: 32,
        borderWidth: 1,
        borderColor: "#FFF",
        borderRadius: 16,
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
    },
    BotaoTransferir:{   
        alignItems:"center",
        padding: 12,
        backgroundColor:"#06454d",
        marginBottom: 16,
        marginTop: 16
    },
    BotaoFechar:{
        fontSize: 24,        
        textAlign: "right",
        marginRight: 48,
        marginBottom: 4
    }
});

export default ModalTransferencia;