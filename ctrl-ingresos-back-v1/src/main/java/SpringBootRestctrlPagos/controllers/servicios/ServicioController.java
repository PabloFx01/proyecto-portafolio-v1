package SpringBootRestctrlPagos.controllers.servicios;

import SpringBootRestctrlPagos.controllers.dto.servicios.ServicioDTO;
import SpringBootRestctrlPagos.controllers.dto.servicios.ServicioDTO1;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.servicios.Servicio;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.servicios.IServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/servicios/servicio")
public class ServicioController {
    @Autowired
    private IServicioService servicioService;
    @Autowired
    private IUserService userService;

    @GetMapping("/findAll")
    public ResponseEntity<?> findAllByUser(@RequestParam String username) {
        List<ServicioDTO> servicioDTOList =
                servicioService.findAllByUser(username)
                        .stream()
                        .map(servicio -> servicioToServicioDTO(servicio))
                        .toList();
        return ResponseEntity.ok(servicioDTOList);
    }

    @GetMapping("/findAllAct")
    public ResponseEntity<?> findAllActByUser(@RequestParam String username) {
        List<ServicioDTO1> servicioDTOList =
                servicioService.findAllActByUser(username)
                        .stream()
                        .map(servicio -> servicioToServicioDTO1(servicio))
                        .toList();
        return ResponseEntity.ok(servicioDTOList);
    }

    @GetMapping("/findAllPagination/{cantidad}/{pagina}/{state}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad
            , @PathVariable("pagina") int pagina
            , @PathVariable("state") String state
            , @RequestParam String username
            , @RequestParam(required = false) String filter) {
        ListadoPaginador<Servicio> listadoPaginador = servicioService.findAllWithPagination(cantidad, pagina, state, username, filter);
        List<ServicioDTO> servicioDTOList = listadoPaginador.getElementos()
                .stream()
                .map(servicio -> servicioToServicioDTO(servicio))
                .toList();
        ListadoPaginador<ServicioDTO> servicioDTOListPag = new ListadoPaginador<>();
        servicioDTOListPag.setCantidadTotal(listadoPaginador.getCantidadTotal());
        servicioDTOListPag.setElementos(servicioDTOList);
        return ResponseEntity.ok(servicioDTOListPag);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        System.out.println("entra");
        Optional<Servicio> optionalServicio = servicioService.findIdAndChildren(id);
        if (optionalServicio.isPresent()) {
            Servicio servicio = optionalServicio.get();
            return ResponseEntity.ok(servicioToServicioDTO(servicio));
        }
        return ResponseEntity.notFound().build();
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ServicioDTO servicioDTO) throws URISyntaxException {
        Optional<Usuario> optionalUser =
                userService.findByUsername(servicioDTO.getUsuario().getUsername());

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            servicioDTO.setUsuario(user);
            servicioService.saveOrUpdate(servicioDTOToServicio(servicioDTO));
            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro creado con éxito.")
                    .build());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody ServicioDTO servicioDTO) throws URISyntaxException {

        Optional<Servicio> optionalServicio = servicioService.findById(id);
        if (optionalServicio.isPresent()) {
            Servicio servicio = optionalServicio.get();
            servicio.setNombre(servicioDTO.getNombre());
            servicio.setActivo(servicioDTO.isActivo());
            servicio.setValor(servicioDTO.getValor());
            servicio.setComentario(servicioDTO.getComentario());
            servicio.setFechaIniVto(servicioDTO.getFechaIniVto());
            servicio.setFechaFinVto(servicioDTO.getFechaFinVto());
            servicio.setPeriodoPago(servicioDTO.getPeriodoPago());
            servicioService.saveOrUpdate(servicio);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro actualizado con éxito.")
                    .build());
        }


        return ResponseEntity.notFound().build();

    }

    @GetMapping("/softDelete/{id}")
    public ResponseEntity<?> softDelete(@PathVariable Long id
    ) throws URISyntaxException {
        Optional<Servicio> optionalServicio = servicioService.findById(id);
        if (optionalServicio.isPresent()) {
            Servicio servicio = optionalServicio.get();
            servicio.setActivo(false);
            servicioService.saveOrUpdate(servicio);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro desactivado con éxito.")
                    .build());
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/updateServicios")
    public ResponseEntity<?> updateServicios(@RequestParam String username) {
        servicioService.updateServicios(username);

        return ResponseEntity.ok(Response.builder()
                .idMessage("201")
                .message("Servicios actualizados con éxito.")
                .build());
    }


    private ServicioDTO servicioToServicioDTO(Servicio servicio) {
        return ServicioDTO.builder()
                .id(servicio.getId())
                .nombre(servicio.getNombre())
                .activo(servicio.isActivo())
                .usuario(Usuario.builder()
                        .id(servicio.getUsuario().getId())
                        .username(servicio.getUsuario().getUsername())
                        .role(servicio.getUsuario().getRole())
                        .build())
                .valor(servicio.getValor())
                .comentario(servicio.getComentario())
                .fechaIniVto(servicio.getFechaIniVto())
                .fechaFinVto(servicio.getFechaFinVto())
                .periodoPago(servicio.getPeriodoPago())
                .build();
    }

    private ServicioDTO1 servicioToServicioDTO1(Servicio servicio) {
        return ServicioDTO1.builder()
                .id(servicio.getId())
                .nombre(servicio.getNombre())
                .activo(servicio.isActivo())
                .usuario(Usuario.builder()
                        .id(servicio.getUsuario().getId())
                        .username(servicio.getUsuario().getUsername())
                        .role(servicio.getUsuario().getRole())
                        .build())
                .valor(servicio.getValor())
                .comentario(servicio.getComentario())
                .fechaIniVto(servicio.getFechaIniVto())
                .fechaFinVto(servicio.getFechaFinVto())
                .periodoPago(servicio.getPeriodoPago())
                .build();
    }

    private Servicio servicioDTOToServicio(ServicioDTO servicioDTO) {

        return Servicio.builder()
                .id(servicioDTO.getId())
                .nombre(servicioDTO.getNombre())
                .activo(servicioDTO.isActivo())
                .usuario(Usuario.builder()
                        .id(servicioDTO.getUsuario().getId())
                        .username(servicioDTO.getUsuario().getUsername())
                        .build())
                .valor(servicioDTO.getValor())
                .comentario(servicioDTO.getComentario())
                .fechaIniVto(servicioDTO.getFechaIniVto())
                .fechaFinVto(servicioDTO.getFechaFinVto())
                .periodoPago(servicioDTO.getPeriodoPago())
                .build();
    }

}
