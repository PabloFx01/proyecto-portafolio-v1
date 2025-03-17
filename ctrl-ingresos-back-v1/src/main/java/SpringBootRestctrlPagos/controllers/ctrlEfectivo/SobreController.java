package SpringBootRestctrlPagos.controllers.ctrlEfectivo;

import SpringBootRestctrlPagos.controllers.dto.ctrlEfectivo.SobreDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Cuenta;
import SpringBootRestctrlPagos.models.entities.ctrlEfectivo.Sobre;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.ctrlEfectivo.ICuentaService;
import SpringBootRestctrlPagos.services.ctrlEfectivo.ISobreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/ctrlEfectivo/sobres")
public class SobreController {
    @Autowired
    private ISobreService sobreService;
    @Autowired
    private ICuentaService cuentaService;
    @Autowired
    private IUserService userService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Sobre> sobreOptional = sobreService.findById(id);
        if (sobreOptional.isPresent()) {
            Sobre sobre = sobreOptional.get();
            SobreDTO sobreDTO = sobreToSobreDTO(sobre);
            return ResponseEntity.ok(sobreDTO);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/findAll")
    public ResponseEntity<?> findAll() {
        List<SobreDTO> sobreList = sobreService.findAll()
                .stream()
                .map(sobre -> sobreToSobreDTO(sobre))
                .toList();

        return ResponseEntity.ok(sobreList);
    }

    @GetMapping("/findAllActByUsername")
    public ResponseEntity<?> findAllActByUsername(@RequestParam String username) {
        List<SobreDTO> sobreList = sobreService.findAllActByUsername(username)
                .stream()
                .map(sobre -> sobreToSobreDTO(sobre))
                .toList();
        return ResponseEntity.ok(sobreList);
    }

    @GetMapping("/findAllPaginadoByUsername/{cantidad}/{pagina}/{state}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @PathVariable("state") String state,
                                               @RequestParam String filter,
                                               @RequestParam String username) {
        ListadoPaginador<Sobre> listadoPaginador =
                sobreService.findAllWithPaginationByUsername(cantidad, pagina, filter, username, state);

        return ResponseEntity.ok(listadoPaginador);
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody SobreDTO sobreDTO) throws URISyntaxException {
        sobreService.saveOrUpdate(sobreDTOToSobre(sobreDTO));
        Response response = new Response();
        response.setIdMessage("201");
        response.setMessage("Registro creado con éxito.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/saveSobreXCuenta")
    public ResponseEntity<?> saveSobreXCuenta(@RequestBody SobreDTO sobreDTO) throws URISyntaxException {
        Optional<Usuario> optionalUser = userService.findByUsername(sobreDTO.getUsuario().getUsername());
        if (optionalUser.isPresent()) {

            try {
                Usuario user = optionalUser.get();

                Sobre sobre = sobreDTOToSobre(sobreDTO);
                sobre.setUsuario(user);
                sobreService.saveOrUpdate(sobre);

                Long nextIdSobre = sobreService.findNextId();
                sobre.setId(nextIdSobre);

                Cuenta nCuenta = new Cuenta();
                nCuenta.setSaldo(0D);
                cuentaService.saveOrUpdate(nCuenta);

                Long nextIdCuenta = cuentaService.findMaxId();
                nCuenta.setId(nextIdCuenta);
                nCuenta.setSobre(sobre);
                cuentaService.saveOrUpdate(nCuenta);
                Response response = new Response();
                response.setIdMessage("201");
                response.setMessage("Registro creado con éxito.");

                return ResponseEntity.ok(response);
            } catch (Exception e) {
                System.out.println(e);
                throw new RuntimeException(e);

            }
        }
        return ResponseEntity.notFound().build();
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody SobreDTO sobreDTO) throws URISyntaxException {
        Optional<Sobre> optionalSobre = sobreService.findById(id);
        if (optionalSobre.isPresent()) {

            Sobre sobre = optionalSobre.get();

            sobre.setDescripcion(sobreDTO.getDescripcion());
            sobreService.saveOrUpdate(sobre);

            Response response = new Response();
            response.setIdMessage("202");
            response.setMessage("Registro modificado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/updateSobreActivo/{id}")
    public ResponseEntity<?> updateSobreActivo(@PathVariable Long id,
                                    @RequestBody SobreDTO sobreDTO) throws URISyntaxException {
        Optional<Sobre> optionalSobre = sobreService.findById(id);
        if (optionalSobre.isPresent()) {

            Sobre sobre = optionalSobre.get();

            sobre.setActivo(false);
            sobreService.saveOrUpdate(sobre);

            Response response = new Response();
            response.setIdMessage("202");
            response.setMessage("Registro restaurado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/updateSobreXCuenta/{id}")
    public ResponseEntity<?> updateSobreXCuenta(@PathVariable Long id,
                                    @RequestBody Sobre sobre) throws URISyntaxException {
     /*   Optional<Sobre> optionalSobre = sobreService.findById(id);
        if (optionalSobre.isPresent()) {

            Sobre sobre = optionalSobre.get();

            sobre.setDescripcion(sobreDTO.getDescripcion());
            sobreService.saveOrUpdate(sobre);
*/
            Response response = new Response();
            response.setIdMessage("202");
            response.setMessage("Registro modificado con éxito.");
            return ResponseEntity.ok(response);
  /*      }
        return ResponseEntity.notFound().build();*/
    }

    @PutMapping("/softDelete/{id}")
    public ResponseEntity<?> softDelete(@PathVariable Long id,
                                        @RequestBody SobreDTO sobreDTO) throws URISyntaxException {
        Optional<Sobre> optionalSobre = sobreService.findById(id);
        if (optionalSobre.isPresent()) {
            Sobre sobre = optionalSobre.get();

            sobre.setActivo(true);

            sobreService.saveOrUpdate(sobre);

            Response response = new Response();
            response.setIdMessage("202");
            response.setMessage("Registro eliminado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Response response = new Response();
        if (id != null) {
            sobreService.deleteById(id);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }


    private SobreDTO sobreToSobreDTO(Sobre sobre) {
        return SobreDTO.builder()
                .id(sobre.getId())
                .descripcion(sobre.getDescripcion())
                .activo(sobre.isActivo())
                //.usuario(sobre.getUsuario())
                .usuario(Usuario.builder()
                        .id(sobre.getUsuario().getId())
                        .username(sobre.getUsuario().getUsername())
                        .role(sobre.getUsuario().getRole())
                        .password("")
                        .build())
                .build();
    }

    private Sobre sobreDTOToSobre(SobreDTO sobreDTO) {
        return Sobre.builder()
                .id(sobreDTO.getId())
                .descripcion(sobreDTO.getDescripcion())
                .activo(sobreDTO.isActivo())
                //.usuario(sobreDTO.getUsuario())
                .usuario(Usuario.builder()
                        .id(sobreDTO.getUsuario().getId())
                        .username(sobreDTO.getUsuario().getUsername())
                        .role(sobreDTO.getUsuario().getRole())
                        .password("")
                        .build())
                .build();
    }

}
