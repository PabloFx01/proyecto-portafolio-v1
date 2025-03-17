package SpringBootRestctrlPagos.controllers.ingresos;

import SpringBootRestctrlPagos.controllers.dto.ingresos.IngresoDTO;
import SpringBootRestctrlPagos.controllers.dto.ingresos.IngresoDTOC1;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ingresos.Ingreso;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.servicios.Factura;
import SpringBootRestctrlPagos.services.ingresos.IIngresoService;
import SpringBootRestctrlPagos.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/ingreso/ingresos")
@CrossOrigin(origins = {"http://localhost:4200"})
public class IngresoController {
    @Autowired
    private IIngresoService ingresoService;
    @Autowired
    private IUserService userService;

    @GetMapping("/findIAndChildrenById/{id}")
    public ResponseEntity<?> findIAndChildrenById(@PathVariable Long id) {
        Optional<Ingreso> optionalIngreso = ingresoService.findIAndChildrenById(id);
        if (optionalIngreso.isPresent()) {
            Ingreso ingreso = optionalIngreso.get();
            return ResponseEntity.ok(ingresoToIngresoDTO(ingreso));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Ingreso> optionalIngreso = ingresoService.findById(id);
        if (optionalIngreso.isPresent()) {
            Ingreso ingreso = optionalIngreso.get();
            return ResponseEntity.ok(ingresoToIngresoDTOC1(ingreso));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAllByUser")
    public ResponseEntity<?> findAllByUser(@RequestParam String username) {
        List<IngresoDTOC1> ingresoList = ingresoService.findAllByUser(username)
                .stream()
                .map(ingreso -> ingresoToIngresoDTOC1(ingreso))
                .toList();
        return ResponseEntity.ok(ingresoList);
    }

    @GetMapping("/findAllConsultaIngresoWithPaginador/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllConsultaIngresoWithPaginador(@PathVariable("cantidad") Long cantidad,
                                                                 @PathVariable("pagina") int pagina,
                                                                 @RequestParam(required = false) String startDate,
                                                                 @RequestParam(required = false) String endDate,
                                                                 @RequestParam(required = false) String titulo,
                                                                 @RequestParam String username) {
        ListadoPaginador<Ingreso> listadoPaginador =
                ingresoService.findAllConsultaIngresoWithPaginador(cantidad,
                        pagina,
                        startDate,
                        endDate,
                        titulo,
                        username);

        return ResponseEntity.ok(listadoPaginador);
    }

    @GetMapping("/findAllConsultaIngreso/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllConsultaIngreso(@PathVariable("cantidad") Long cantidad,
                                                                 @PathVariable("pagina") int pagina,
                                                                 @RequestParam(required = false) String startDate,
                                                                 @RequestParam(required = false) String endDate,
                                                                 @RequestParam(required = false) String titulo,
                                                                 @RequestParam String username) {
        List<Ingreso> listado =
                ingresoService.findAllConsultaIngreso(cantidad,
                        pagina,
                        startDate,
                        endDate,
                        titulo,
                        username);

        List<IngresoDTOC1> ingresoList = listado
                .stream()
                .map(ingreso -> ingresoToIngresoDTOC1(ingreso))
                .toList();
        return ResponseEntity.ok(ingresoList);


    }

    @GetMapping("/findAllAndChildrenByUser")
    public ResponseEntity<?> findAllAndChildrenByUser(@RequestParam String username) {
        List<IngresoDTO> ingresoList = ingresoService.findAllAndChildrenByUser(username)
                .stream()
                .map(ingreso -> ingresoToIngresoDTO(ingreso))
                .toList();
        return ResponseEntity.ok(ingresoList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody IngresoDTO ingresoDTO) throws URISyntaxException {
        Ingreso ingreso = ingresoDTOToIngreso(ingresoDTO);
        Optional<Usuario> optionalUser = userService.findByUsername(ingreso.getUsuario().getUsername());
        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            ingreso.setUsuario(user);
            ingresoService.saveOrUpdate(ingreso);
            ingresoService.AsociarConceptos(ingreso, null);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro creado con éxito").build());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody IngresoDTO ingresoDTO) throws URISyntaxException {
        Optional<Ingreso> optionalIngreso = ingresoService.findIAndChildrenById(id);
        if (optionalIngreso.isPresent()) {

            Ingreso oldIngreso = optionalIngreso.get();
            oldIngreso.setMontoIngreso(ingresoDTO.getMontoIngreso());
            oldIngreso.setFechaDeposito(ingresoDTO.getFechaDeposito());
            oldIngreso.setTMoneda(ingresoDTO.getTMoneda());

            oldIngreso.setComentario(ingresoDTO.getComentario());
            boolean oldAsociar = oldIngreso.isAsociarConceptos();
            oldIngreso.setAsociarConceptos(ingresoDTO.isAsociarConceptos());
            ingresoService.saveOrUpdate(oldIngreso);
            if(ingresoDTO.isAsociarConceptos() != oldAsociar){
                ingresoService.AsociarConceptos(oldIngreso, id);
            }

            return ResponseEntity.ok(Response.builder()
                    .idMessage("202")
                    .message("Registro modificado con éxito").build());
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (id != null) {
            ingresoService.deleteById(id);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("203")
                    .message("Registro eliminado con éxito").build());
        }
        return ResponseEntity.badRequest().build();
    }

    private IngresoDTO ingresoToIngresoDTO(Ingreso ingreso) {
        return IngresoDTO.builder()
                .id(ingreso.getId())
                .montoIngreso(ingreso.getMontoIngreso())
                .fechaDeposito(ingreso.getFechaDeposito())
                .tMoneda(ingreso.getTMoneda())
                .detallesIngreso(ingreso.getDetallesIngreso())
                .comentario(ingreso.getComentario())
                .asociarConceptos(ingreso.isAsociarConceptos())
                .usuario(ingreso.getUsuario())
                .build();
    }

    private IngresoDTOC1 ingresoToIngresoDTOC1(Ingreso ingreso) {
        return IngresoDTOC1.builder()
                .id(ingreso.getId())
                .montoIngreso(ingreso.getMontoIngreso())
                .fechaDeposito(ingreso.getFechaDeposito())
                .tMoneda(ingreso.getTMoneda())
                .comentario(ingreso.getComentario())
                .asociarConceptos(ingreso.isAsociarConceptos())
                .usuario(ingreso.getUsuario())
                .build();
    }

    private Ingreso ingresoDTOToIngreso(IngresoDTO ingresoDTO) {
        return Ingreso.builder()
                .id(ingresoDTO.getId())
                .montoIngreso(ingresoDTO.getMontoIngreso())
                .fechaDeposito(ingresoDTO.getFechaDeposito())
                .tMoneda(ingresoDTO.getTMoneda())
                .detallesIngreso(ingresoDTO.getDetallesIngreso())
                .comentario(ingresoDTO.getComentario())
                .asociarConceptos(ingresoDTO.isAsociarConceptos())
                .usuario(ingresoDTO.getUsuario())
                .build();
    }
}
