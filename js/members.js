miembros = data
const member_group = d3.select("#members") // contenedor de los miembros
let col_index = 0
let row_index = 0
let id_name = ""

//Disposicion de los datos en dos columnas
miembros.data.forEach(element => {
  id_name = "row-"+row_index+"-col-"+col_index
  if (col_index == 0){
    row = member_group.append("div").attr("class","row p-2").attr("id","row_"+row_index)
    row.append("div").attr("id",id_name).attr("class","col")
    col_index++
  } else {
    row.append("div").attr("id",id_name).attr("class","col")
    col_index=0
    row_index++
  }
  addMember(element,id_name)
});

//Agrega una tarjeta con los datos y la foto de la persona
function addMember(member_data,row_col_id){
  member = d3.select("#"+row_col_id).append("div").attr("class","card p-3")
    .append("div").attr("class","row").attr("id",member_data.matricula)

  member_avatar = member
    .append("div").attr("class","col-3")
    .append("img").attr("class","rounded-circle").attr("src", "img/"+member_data.matricula+".png").attr("height", "80")

  member_details_container = member
    .append("class").attr("class","col-9")
    .append("div")

  member_details_container.append("strong").text(member_data.nombre)
  member_details_container.append("div").text("Matricula "+member_data.matricula)
  member_details_container.append("div").text(member_data.ciudad)
}
