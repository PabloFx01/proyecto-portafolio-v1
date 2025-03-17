package SpringBootRestctrlPagos.controllers.projectManagement;

import SpringBootRestctrlPagos.controllers.dto.prestamos.PrestamoDTO;
import SpringBootRestctrlPagos.controllers.dto.projectManagement.ProjectManagementDTO;
import SpringBootRestctrlPagos.controllers.dto.projectManagement.TaskDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.prestamos.Prestamo;
import SpringBootRestctrlPagos.models.entities.projectManagement.ProjectManagement;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.prestamos.IPrestamoService;
import SpringBootRestctrlPagos.services.projectManagement.IProjectManagementService;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.sql.Time;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/pm/projectManagement")
@CrossOrigin(origins = {"http://localhost:4200"})
public class ProjectManagementController {
    @Autowired
    private IProjectManagementService pmService;
    @Autowired
    private IUserService userService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findPMAndChildrenById(@PathVariable Long id) {
        Optional<ProjectManagement> optionalProjectManagement = pmService.findPMAndChildrenById(id);
        if (optionalProjectManagement.isPresent()) {
            ProjectManagement pm = optionalProjectManagement.get();
            return ResponseEntity.ok(pmToPmDTO(pm));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAllPaginadoByUsername/{cantidad}/{pagina}/{state}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @PathVariable("state") String state,
                                               @RequestParam String filter,
                                               @RequestParam String username) {
        ListadoPaginador<ProjectManagement> listadoPaginador =
                pmService.findAllWithPaginationByUsername(cantidad, pagina, filter, username, state);

        return ResponseEntity.ok(listadoPaginador);
    }


    @GetMapping("/findAllEndAndChildrenByUser")
    public ResponseEntity<?> findAllEndAndChildrenByUser(@RequestParam String username) {
        List<ProjectManagementDTO> pmDTOList = pmService.findAllEndAndChildrenByUser(username)
                .stream()
                .map(pm -> pmToPmDTO(pm))
                .toList();
        return ResponseEntity.ok(pmDTOList);
    }

    @GetMapping("/findAllNotEndAndChildrenByUser")
    public ResponseEntity<?> findAllNotEndAndChildrenByUser(@RequestParam String username) {
        List<ProjectManagementDTO> pmDTOList = pmService.findAllNotEndAndChildrenByUser(username)
                .stream()
                .map(pm -> pmToPmDTO(pm))
                .toList();
        return ResponseEntity.ok(pmDTOList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ProjectManagementDTO pmDTO) throws URISyntaxException {

        ProjectManagement pm = pmDTOToPm(pmDTO);
        Optional<Usuario> optionalUser = userService.findByUsername(pm.getUsuario().getUsername());
        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            pm.setUsuario(user);
            pmService.saveOrUpdate(pm);

            return ResponseEntity.ok(Response.builder()
                    .idMessage("201")
                    .message("Registro creado con éxito").build());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody ProjectManagementDTO pmDTO) throws URISyntaxException {
        Optional<ProjectManagement> optionalProjectManagement = pmService.findPMAndChildrenById(id);
        if (optionalProjectManagement.isPresent()) {

            ProjectManagement oldPm = optionalProjectManagement.get();
            Optional<Usuario> optionalUser = userService.findByUsername(pmDTO.getUsuario().getUsername());
            if (optionalUser.isPresent()) {
                try {
                    Usuario user = optionalUser.get();
                    oldPm.setUsuario(user);

                    oldPm.setNombre(pmDTO.getNombre());
                    oldPm.setFechaCreacion(pmDTO.getFechaCreacion());
                    oldPm.setFechaIniProject(pmDTO.getFechaIniProject());
                    oldPm.setTasks(pmDTO.getTasks());
                    oldPm.setHoraEstimada(pmDTO.getHoraEstimada());
                    oldPm.setEstado(pmDTO.isEstado());
                    pmService.saveOrUpdate(oldPm);

                    return ResponseEntity.ok(Response.builder()
                            .idMessage("202")
                            .message("Registro modificado con éxito").build());

                } catch (Exception e) {
                    System.out.println(e);
                    throw new RuntimeException(e);
                }
            }


        }
        System.out.println("da error");
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/finalizarPM/{idPM}")
    public ResponseEntity<?> efectuarPago(@PathVariable Long idPM,
                                          @RequestBody ProjectManagementDTO pmDTO) throws URISyntaxException {
        try {
            Optional<ProjectManagement> optP = pmService.findPMAndChildrenById(idPM);
            if (optP.isPresent()) {
                ProjectManagement oldP = optP.get();

                oldP.setEstado(true);
                pmService.saveOrUpdate(oldP);

                return ResponseEntity.ok(Response.builder()
                        .idMessage("202")
                        .message("Registro modificado con éxito").build());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (id != null) {
            pmService.deleteById(id);
            return ResponseEntity.ok(Response.builder()
                    .idMessage("203")
                    .message("Registro eliminado con éxito").build());
        }
        return ResponseEntity.badRequest().build();
    }

    private ProjectManagementDTO pmToPmDTO(ProjectManagement pm) {
        return ProjectManagementDTO.builder()
                .id(pm.getId())
                .nombre(pm.getNombre())
                .fechaCreacion(pm.getFechaCreacion())
                .fechaIniProject(pm.getFechaIniProject())
                .tasks(pm.getTasks())
                .horaEstimada(pm.getHoraEstimada())
                .estado(pm.isEstado())
                .usuario(Usuario.builder()
                        .id(pm.getUsuario().getId())
                        .username(pm.getUsuario().getUsername())
                        .role(pm.getUsuario().getRole())
                        .password("")
                        .build())
                .build();
    }

    private ProjectManagement pmDTOToPm(ProjectManagementDTO pmDTO) {
        return ProjectManagement.builder()
                .id(pmDTO.getId())
                .nombre(pmDTO.getNombre())
                .fechaCreacion(pmDTO.getFechaCreacion())
                .fechaIniProject(pmDTO.getFechaIniProject())
                .tasks(pmDTO.getTasks())
                .horaEstimada(pmDTO.getHoraEstimada())
                .estado(pmDTO.isEstado())
                .usuario(Usuario.builder()
                        .id(pmDTO.getUsuario().getId())
                        .username(pmDTO.getUsuario().getUsername())
                        .role(pmDTO.getUsuario().getRole())
                        .password("")
                        .build())
                .build();
    }
}
