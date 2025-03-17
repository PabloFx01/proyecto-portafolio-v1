package SpringBootRestctrlPagos.controllers.ingresos;

import SpringBootRestctrlPagos.controllers.dto.ingresos.ConceptoDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.ingresos.Concepto;
import SpringBootRestctrlPagos.models.entities.ingresos.ConceptoId;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.services.ingresos.IConceptoService;
import SpringBootRestctrlPagos.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/ingreso/conceptos")
@CrossOrigin(origins = {"http://localhost:4200"})
public class ConceptoController {
    @Autowired
    private IConceptoService conceptoService;
    @Autowired
    private IUserService userService;

    @GetMapping("/findAll")
    public ResponseEntity<?> findAllByUser(@RequestParam String username) {
        List<ConceptoDTO> conceptoDTOList =
                conceptoService.findAllByUser(username)
                        .stream()
                        .map(concepto -> conceptoToConceptoDTO(concepto))
                        .toList();
        return ResponseEntity.ok(conceptoDTOList);
    }

    @GetMapping("/findAllAct")
    public ResponseEntity<?> findAllActByUser(@RequestParam String username) {
        List<ConceptoDTO> conceptoDTOList =
                conceptoService.findAllActByUser(username)
                        .stream()
                        .map(concepto -> conceptoToConceptoDTO(concepto))
                        .toList();
        return ResponseEntity.ok(conceptoDTOList);
    }

    @GetMapping("/findAllPagination/{cantidad}/{pagina}/{state}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad
            , @PathVariable("pagina") int pagina
            , @PathVariable("state") String state
            , @RequestParam String username
            , @RequestParam(required = false) String filter) {
        ListadoPaginador<Concepto> listadoPaginador = conceptoService.findAllWithPagination(cantidad, pagina, state, username, filter);
        List<ConceptoDTO> metalDTOList = listadoPaginador.getElementos()
                .stream()
                .map(cpto -> conceptoToConceptoDTO(cpto))
                .toList();
        ListadoPaginador<ConceptoDTO> metalDTOListadoPaginador = new ListadoPaginador<>();
        metalDTOListadoPaginador.setCantidadTotal(listadoPaginador.getCantidadTotal());
        metalDTOListadoPaginador.setElementos(metalDTOList);
        return ResponseEntity.ok(metalDTOListadoPaginador);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id, @RequestParam String username) {
        Optional<Usuario> optionalUser = userService.findByUsername(username);

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            Optional<Concepto> optionalConcepto = conceptoService.findById(
                    ConceptoId.builder()
                            .idConcepto(id)
                            .idUsuario(user.getId())
                            .build());
            if (optionalConcepto.isPresent()) {
                Concepto concepto = optionalConcepto.get();
                return ResponseEntity.ok(conceptoToConceptoDTO(concepto));
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ConceptoDTO conceptoDTO) throws URISyntaxException {
        Optional<Usuario> optionalUser = userService.findByUsername(conceptoDTO.getUsuario().getUsername());

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            conceptoDTO.setUsuario(user);
            conceptoDTO.setConceptoId(ConceptoId.builder()
                    .idConcepto(conceptoService.findNextIdByUser(user.getId()))
                    .idUsuario(user.getId())
                    .build());
            conceptoDTO.setActivo(true);
            conceptoService.saveOrUpdate(conceptoDTOToConcepto(conceptoDTO));
            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro creado con éxito.")
                    .build());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody ConceptoDTO conceptoDTO) throws URISyntaxException {
        Optional<Usuario> optionalUser = userService.findByUsername(conceptoDTO.getUsuario().getUsername());
        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            Optional<Concepto> optionalConcepto = conceptoService.findById(
                    ConceptoId.builder()
                            .idConcepto(id)
                            .idUsuario(user.getId())
                            .build());
            if (optionalConcepto.isPresent()) {
                Concepto concepto = optionalConcepto.get();
                concepto.setNombre(conceptoDTO.getNombre());
                concepto.setActivo(conceptoDTO.isActivo());
                concepto.setPorcentaje(conceptoDTO.getPorcentaje());

                conceptoService.saveOrUpdate(concepto);
                return ResponseEntity.ok(Response.builder()
                        .idMessage("201")
                        .message("Registro actualizado con éxito.")
                        .build());
            }

        }
        return ResponseEntity.notFound().build();

    }

    @PutMapping("/updateActivo/{id}")
    public ResponseEntity<?> updateActivo(@PathVariable Long id,
                                    @RequestBody ConceptoDTO conceptoDTO) throws URISyntaxException {
        Optional<Usuario> optionalUser = userService.findByUsername(conceptoDTO.getUsuario().getUsername());
        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            Optional<Concepto> optionalConcepto = conceptoService.findById(
                    ConceptoId.builder()
                            .idConcepto(id)
                            .idUsuario(user.getId())
                            .build());
            if (optionalConcepto.isPresent()) {
                Concepto concepto = optionalConcepto.get();
                concepto.setActivo(true);

                conceptoService.saveOrUpdate(concepto);
                return ResponseEntity.ok(Response.builder()
                        .idMessage("201")
                        .message("Registro actualizado con éxito.")
                        .build());
            }

        }
        return ResponseEntity.notFound().build();

    }

    @GetMapping("/softDelete/{id}")
    public ResponseEntity<?> softDelete(@PathVariable Long id,
                                        @RequestParam String username
    ) throws URISyntaxException {
        Optional<Usuario> optionalUser = userService.findByUsername(username);
        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            Optional<Concepto> optionalConcepto = conceptoService.findById(ConceptoId.builder()
                    .idConcepto(id)
                    .idUsuario(user.getId())
                    .build());
            if (optionalConcepto.isPresent()) {
                Concepto concepto = optionalConcepto.get();
                concepto.setActivo(false);

                conceptoService.saveOrUpdate(concepto);
                return ResponseEntity.ok(Response.builder()
                        .idMessage("201")
                        .message("Registro desactivado con éxito.")
                        .build());
            }
        }
        return ResponseEntity.notFound().build();
    }

    private ConceptoDTO conceptoToConceptoDTO(Concepto concepto) {
        return ConceptoDTO.builder()
                .conceptoId(concepto.getConceptoId())
                .nombre(concepto.getNombre())
                .activo(concepto.isActivo())
                .usuario(concepto.getUsuario())
                .porcentaje(concepto.getPorcentaje())
                .build();
    }

    private Concepto conceptoDTOToConcepto(ConceptoDTO conceptoDTO) {
        return Concepto.builder()
                .conceptoId(conceptoDTO.getConceptoId())
                .nombre(conceptoDTO.getNombre())
                .activo(conceptoDTO.isActivo())
                .usuario(conceptoDTO.getUsuario())
                .porcentaje(conceptoDTO.getPorcentaje())
                .build();
    }

}
