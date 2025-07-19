import {View, TextInput, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const mesesDoAno = [
    "Janeiro", 
    "Fevereiro", 
    "Março", 
    "Abril", 
    "Maio", 
    "Junho", 
    "Julho", 
    "Agosto", 
    "Setembro", 
    "Outubro", 
    "Novembro", 
    "Dezembro"]

    //PREPARA O PICKER MESES
export const SeletorMesAno = ({aoMudarMes,aoMudarAno,mesSelecionado,anoSelecionado,aoConfirmarAno})=>{

    let pickersMes = [];
    
    for(let i=0; i<mesesDoAno.length;i++){
        pickersMes.push(<Picker.Item    
                                     label={mesesDoAno[i]}
                                        value={i} 
                                        key={i}/>)
    }

    pickersMes.push(<Picker.Item    
                    label={"ANUAL"}
                    value={13} 
                    key={13}/>);

    console.log(mesSelecionado);

    return (
        <View style={estilo.container}>
            <Picker 
                onValueChange={aoMudarMes}
                selectedValue={mesSelecionado}
                style={estilo.mes}>
                {pickersMes}
            </Picker>

            <TextInput 
                value={anoSelecionado.toString()} 
                placeholder={anoSelecionado.toString()}
                style={estilo.ano}
                onChangeText={aoMudarAno}
                onSubmitEditing={aoConfirmarAno}
                />
        </View>
    );
}

let estilo = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'center'
    },
    ano:{
        width:64,
        textAlign:"center",
        backgroundColor:'#000000ff'
    },
    mes:{
        width:180,
        backgroundColor:'#424242ff'
    }
})