# Proyecto Final de Aplicaciones Móviles - Aplicación de Lista de Compras
### Elaborado por: Stephanie Muñoz, Mateo Borja, Stiven López
#### Video Explicativo de la aplicación: https://youtu.be/lBRNENYCngE
#### Video Explicativo del código: https://www.youtube.com/watch?v=NnaXlQOXy7I

Este proyecto consiste en una aplicación móvil para dispositivos Android realizada con React Native. Permite a los usuarios llevar una o varias lista de compras en su celular
para hacer más fácil la compra de víveres en un supermercado.

### Modo de Uso

Las funcionalidades presentes en esta aplicación son:

- Registro/inicio de sesión con correo electrónico
- Cambio de datos en perfil
- Recuperación de contraseña
- Creación de listas de compras
- Edición y elmininación de listas creadas
- Uso de listas de compras

Al abrir la aplicación por primera vez, se mostrará la siguiente pantalla de inicio donde se pedirá al usuario que se registre o inicie sesión

![image](https://user-images.githubusercontent.com/66144847/156697345-dcde8dad-6494-4ac6-a202-50e4cac10382.png)

Ingresando en cualquiera de las dos opciones, el usuario llegará a la pantalla respectiva donde se le pedirá que ingrese un correo electrónico y una contraseña

![image](https://user-images.githubusercontent.com/66144847/156697820-1a514560-c1f4-43b0-b4c9-9faed0ac98f2.png)

El correo electrónico debe ser válido ya que se podrá utilizar para recuperar la contraseña en caso de que el usuario la olvide. En esta función el usuario deberá ingresar su correo y la aplicación enviará un enlace a dicho correo desde donde se podrá cambiar la contraseña.

![image](https://user-images.githubusercontent.com/66144847/156698205-ae7d3a7c-a8e8-413f-baec-9811d1aba944.png)

El mismo correo también será usado para enviar un correo de verificación cuando se registra una cuenta

![image](https://user-images.githubusercontent.com/66144847/156698298-6928cdd0-588e-4f09-b03b-4adf00ee1852.png)

**Nota:** La funcionalidad de recuperación existe en caso de ser necesaria, pero en la mayoría de casos no lo será ya que la sesión se mantiene iniciada en un mismo teléfono incluso si se sale de la aplicación. El usuario también puede cerrar sesión si lo desea.

Los datos ingresados también pueden ser modificados en el perfil de usuario en la aplicación, esto incluye correo electrónico, nombre de usuario y contraseña

![image](https://user-images.githubusercontent.com/66144847/156698873-3f8f7c93-acc1-4846-baf7-0cd9606aa2fa.png)

La pantalla de edición de contraseña también se mostrará al recuperarla

![image](https://user-images.githubusercontent.com/66144847/156699023-d1bcccb0-63fb-4b9a-ab81-a27df5e79b83.png)

Una vez dentro de la aplicación, se podrán observar todas las listas que se han creado o un mensaje que indica que no se han creado listas aún. Se puede crear más listas con el botón + de la esquina inferior y, como se puede observar en la imagen, la lista tendrá un nombre e imágenes de los productos que se han añadido a ella

![image](https://user-images.githubusercontent.com/66144847/156700801-60839a8a-c35e-4a8d-808f-8b76b21da6c0.png)

Utilizando los íconos de cada lista se podrá editar su nombre y contenido o eliminarla

![image](https://user-images.githubusercontent.com/66144847/156700941-17d56814-45e9-49e8-b8b1-ca0e3bbd4f3d.png)

La forma en que se edita el contenido de una lista es seleccionando de entre los productos disponibles cuales se quiere agregar o eliminar de una lista, cada producto tiene una opción junto a él para hacerlo

![image](https://user-images.githubusercontent.com/66144847/156701115-16694dec-b577-4da4-a020-a89a9596a71b.png)

Finalmente, seleccionando una lista, se podrá tendrán checkboxes junto a cada producto para que se pueda tachar lo que ya se ha comprado. Estos vistos se vaciarán la siguiente vez que se abra la lista para poder ver la lista desde cero y evitar que el usuario tenga que quitarlos manualmente

![image](https://user-images.githubusercontent.com/66144847/156701559-b15df18f-d45a-4452-a33e-d3b4557c3003.png)

