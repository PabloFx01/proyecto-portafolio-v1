package SpringBootRestctrlPagos.controllers.metales;

import SpringBootRestctrlPagos.controllers.dto.metales.*;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.metales.*;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.metales.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/metalesApp/metal")
public class MetalController {
    @Autowired
    private IMetalService metalService;
    @Autowired
    private IVentaService ventaService;

    @Autowired
    private IUserService userService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        try {
            Optional<Metal> metalOptional =
                    metalService.findById(MetalId.builder()
                    .id(id)
                    .build());
            if (metalOptional.isPresent()) {
                Metal metal = metalOptional.get();
                MetalDTO metalDTO = metalToMetalDTO(metal);
                return ResponseEntity.ok(metalDTO);
            }
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAllAct(@RequestParam String username) {
        List<MetalDTO> metalList = metalService.findAllAct(username)
                .stream()
                .map(metal -> metalToMetalDTO(metal))
                .toList();
        return ResponseEntity.ok(metalList);
    }

    @GetMapping("/findAllPagination/{cantidad}/{pagina}/{state}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad
            , @PathVariable("pagina") int pagina
            , @PathVariable("state") String state
            , @RequestParam String filter,
                                               @RequestParam String username) {
        ListadoPaginador<Metal> listadoPaginador = metalService.findAllWithPagination(cantidad, pagina, state, filter, username);
        List<MetalDTO> metalDTOList = listadoPaginador.getElementos()
                .stream()
                .map(metal -> metalToMetalDTO(metal))
                .toList();
        ListadoPaginador<MetalDTO> metalDTOListadoPaginador = new ListadoPaginador<>();
        metalDTOListadoPaginador.setCantidadTotal(listadoPaginador.getCantidadTotal());
        metalDTOListadoPaginador.setElementos(metalDTOList);
        return ResponseEntity.ok(metalDTOListadoPaginador);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody MetalDTO metalDTO) throws URISyntaxException {
        Response response = new Response();
        try {

            Optional<Usuario> optionalUser = userService.findByUsername(metalDTO.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                Usuario user = optionalUser.get();
                metalDTO.setUsuario(user);

                metalDTO.generateId(user.getId());
                Optional<Metal> metalOptional = metalService.findById(metalDTO.getMetalId());
                if (metalOptional.isPresent()) {
                    response.setMessage("Error: El registro ya existe.");
                    response.setIdMessage("409");
                } else {

                    metalService.saveOrUpdate(metalDTOToMetal(metalDTO));
                    response.setMessage("Registro creado con exito");
                    response.setIdMessage("201");
                }
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            // Manejo de otras excepciones
            System.out.println(e);
            response.setMessage("Error interno del servidor");
            response.setIdMessage("500");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        response.setMessage("Error interno del servidor");
        response.setIdMessage("500");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody MetalDTO metalDTO) throws URISyntaxException {
        Response response = new Response();
        Optional<Metal> metalOptional = metalService.findById(MetalId.builder().id(id).build());
        if (metalOptional.isPresent()) {
            metalService.update(MetalId.builder().id(id).build(), metalDTOToMetal(metalDTO));
            response.setIdMessage("201");
            response.setMessage("Registro actualizado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/softDelete/{id}")
    public ResponseEntity<?> softDelete(@PathVariable String id,
                                        @RequestBody MetalDTO metalDTO) {
        Response response = new Response();
        Optional<Metal> metalOptional = metalService.findById(MetalId.builder().id(id).build());
        if (metalOptional.isPresent()) {
            metalService.softDelete(metalOptional.get());
            response.setIdMessage("200");
            response.setMessage("Registro eliminado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/restaurar/{id}")
    public ResponseEntity<?> restaurar(@PathVariable String id,
                                       @RequestBody MetalDTO metalDTO) {
        Response response = new Response();
        Optional<Metal> metalOptional = metalService.findById(MetalId.builder().id(id).build());
        if (metalOptional.isPresent()) {
            metalService.restaurar(metalOptional.get());
            response.setIdMessage("200");
            response.setMessage("Registro restaurado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (id != null) {
            metalService.deleteById(MetalId.builder().id(id).build());
            return ResponseEntity.ok("Registro eliminado");
        }
        return ResponseEntity.badRequest().build();
    }

    private MetalDTO metalToMetalDTO(Metal metal) {
        return MetalDTO.builder()
                .metalId(metal.getMetalId())
                .precio(metal.getPrecio())
                .nombre(metal.getNombre())
                .fechaIni(metal.getFechaIni())
                .fechaFin(metal.getFechaFin())
                .editadoPor(metal.getEditadoPor())
                .modificadoEl(metal.getModificadoEl())
                .usuario(metal.getUsuario())
                .build();
    }

    private Metal metalDTOToMetal(MetalDTO metalDTO) {
        return Metal.builder()
                .metalId(metalDTO.getMetalId())
                .precio(metalDTO.getPrecio())
                .nombre(metalDTO.getNombre())
                .fechaIni(metalDTO.getFechaIni())
                .fechaFin(metalDTO.getFechaFin())
                .editadoPor(metalDTO.getEditadoPor())
                .modificadoEl(metalDTO.getModificadoEl())
                .usuario(metalDTO.getUsuario())
                .build();
    }

}
