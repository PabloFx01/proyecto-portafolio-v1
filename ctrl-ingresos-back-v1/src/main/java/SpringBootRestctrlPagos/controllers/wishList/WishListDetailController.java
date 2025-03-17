package SpringBootRestctrlPagos.controllers.wishList;

import SpringBootRestctrlPagos.controllers.dto.wishList.WishListDetailDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.entities.wishList.WishDetailId;
import SpringBootRestctrlPagos.models.entities.wishList.WishList;
import SpringBootRestctrlPagos.models.entities.wishList.WishListDetail;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.wishList.IWishListDetailService;
import SpringBootRestctrlPagos.services.wishList.IWishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/wish-list/wish-list/details")
public class WishListDetailController {
    @Autowired
    private IWishListDetailService dWishListService;
    @Autowired
    private IWishListService wishListService;
    @Autowired
    private IUserService userService;

    @GetMapping("/findDWByIdAndIdWishList/{id}/{idWishList}")
    public ResponseEntity<?> findDWByIdAndIdWishList(@PathVariable Long id, @PathVariable Long idWishList) {
        Optional<WishListDetail> optionalDWishList = dWishListService.findWDByIdAndIdWish(id, idWishList);
        if (optionalDWishList.isPresent()) {
            WishListDetail dWishList = optionalDWishList.get();
            return ResponseEntity.ok(wishListDetailToWishListDetailDTO(dWishList));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAllByIdWish/{IdPrestamo}")
    public ResponseEntity<?> findAllByIdWish(@PathVariable Long idWishList) {
        List<WishListDetailDTO> dWishListList = dWishListService.findAllByIdWish(idWishList)
                .stream()
                .map(dWishList -> wishListDetailToWishListDetailDTO(dWishList))
                .toList();
        return ResponseEntity.ok(dWishListList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody WishListDetailDTO dWishListDTO) throws URISyntaxException {
        WishListDetail dWishList = wishListDetailDTOToWishListDetail(dWishListDTO);
        Long idWishList = dWishList.getWishDetailId().getIdWish();
        Long nextIdDetalle = dWishListService.findNextIdByIdWish(idWishList);
        dWishList.setWishDetailId
                (WishDetailId.builder()
                        .idWish(idWishList)
                        .id(nextIdDetalle).build());
        dWishListService.saveOrUpdate(dWishList);

        return ResponseEntity.ok(Response.builder()
                .idMessage("201")
                .message("Registro creado con éxito").build());

    }

    @PutMapping("/update/{id}/{idWish}")
    public ResponseEntity<?> updateMontos(@PathVariable Long id,
                                          @PathVariable Long idWish,
                                          @RequestBody WishListDetailDTO dWishDTO) throws URISyntaxException {
        try {
            Optional<WishListDetail> optDW = dWishListService.findWDByIdAndIdWish(id, idWish);
            if (optDW.isPresent()) {
                WishListDetail oldDW = optDW.get();
                oldDW.setFechaDetail(dWishDTO.getFechaDetail());
                oldDW.setLink(dWishDTO.getLink());
                oldDW.setPrecio(dWishDTO.getPrecio());
                oldDW.setComentario(dWishDTO.getComentario());
                oldDW.setItemName(dWishDTO.getItemName());
                dWishListService.saveOrUpdate(oldDW);

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

    @PutMapping("/updateProcesarWish/{id}/{idWish}")
    public ResponseEntity<?> updateMontosProcesarWish(@PathVariable Long id,
                                                      @PathVariable Long idWish,
                                                      @RequestBody WishListDetailDTO dWishDTO) throws URISyntaxException {
        try {
            Optional<WishListDetail> optDW = dWishListService.findWDByIdAndIdWish(id, idWish);
            if (optDW.isPresent()) {
                WishListDetail oldDW = optDW.get();
                oldDW.setProcesarDetail(true);
                dWishListService.saveOrUpdate(oldDW);
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



    /*@PutMapping("/update/{id}/{idPrestamo}")
    public ResponseEntity<?> updateMontos(@PathVariable Long id,
                                          @PathVariable Long idPrestamo,
                                          @RequestBody DetallePrestamoDTO dPrestamoDTO) throws URISyntaxException {
        try {
            Optional<DetallePrestamo> optDP = dPrestamoService.findDIByIdAndIdPrestamo(id, idPrestamo);
            if (optDP.isPresent()) {
                DetallePrestamo oldDP = optDP.get();

                Prestamo prestamo = prestamoService.findPAndChildrenById(idPrestamo).get();
                Double saldoRest = prestamo.getSaldoRest();
                Double totPag = prestamo.getTotPag();
                Double oldPago = oldDP.getMontoPago();
                Double newPago = dPrestamoDTO.getMontoPago();
                Double difPagos = oldPago - newPago;
                Double nTotPag = 0D;
                Double nSaldoRest = 0D;
                if (difPagos < 0) {
                    //es negativo, en prestamo:
                    //saldoRest se resta
                    //totPag se suma
                    //difPagos se pasa a positivo
                    Double nDifPagos = difPagos * -1;
                    nSaldoRest = saldoRest - nDifPagos;
                    nTotPag = totPag + nDifPagos;
                } else if (difPagos > 0) {
                    //es positivo, en prestamo:
                    //saldoRest se suma
                    //totPag se resta
                    nSaldoRest = saldoRest + difPagos;
                    nTotPag = totPag - difPagos;
                }

                prestamo.setSaldoRest(nSaldoRest);
                prestamo.setTotPag(nTotPag);


                oldDP.setFechaPago(dPrestamoDTO.getFechaPago());
                oldDP.setMontoPago(dPrestamoDTO.getMontoPago());
                dPrestamoService.saveOrUpdate(oldDP);
                prestamoService.saveOrUpdate(prestamo);

                return ResponseEntity.ok(Response.builder()
                        .idMessage("202")
                        .message("Registro modificado con éxito").build());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }*/


  /*  @PutMapping("/efectuarPago/{id}/{idPrestamo}")
    public ResponseEntity<?> efectuarPago(@PathVariable Long id,
                                          @PathVariable Long idPrestamo,
                                          @RequestBody DetallePrestamoDTO dPrestamoDTO) throws URISyntaxException {
        try {
            Optional<DetallePrestamo> optDP = dPrestamoService.findDIByIdAndIdPrestamo(id, idPrestamo);
            if (optDP.isPresent()) {
                DetallePrestamo oldDP = optDP.get();

                oldDP.setPagoEfectuado(true);
                dPrestamoService.saveOrUpdate(oldDP);

                return ResponseEntity.ok(Response.builder()
                        .idMessage("202")
                        .message("Registro modificado con éxito").build());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e);

        }
        return ResponseEntity.notFound().build();
    }*/


    @DeleteMapping("/delete/{id}/{idWishList}")
    public ResponseEntity<?> delete(@PathVariable Long id, @PathVariable Long idWishList) {


        dWishListService.deleteById(WishDetailId.builder()
                .idWish(idWishList)
                .id(id).build());

        return ResponseEntity.ok(Response.builder()
                .idMessage("203")
                .message("Registro eliminado con éxito").build());

    }

    private WishListDetailDTO wishListDetailToWishListDetailDTO(WishListDetail dWishList) {
        return WishListDetailDTO.builder()
                .wishDetailId(dWishList.getWishDetailId())
                .fechaDetail(dWishList.getFechaDetail())
                .itemName(dWishList.getItemName())
                .precio(dWishList.getPrecio())
                .comentario(dWishList.getComentario())
                .link(dWishList.getLink())
                .procesarDetail(dWishList.isProcesarDetail())
                .wishList(dWishList.getWishList())
                .build();
    }

    private WishListDetail wishListDetailDTOToWishListDetail(WishListDetailDTO dWishListDTO) {
        return WishListDetail.builder()
                .wishDetailId(dWishListDTO.getWishDetailId())
                .fechaDetail(dWishListDTO.getFechaDetail())
                .itemName(dWishListDTO.getItemName())
                .precio(dWishListDTO.getPrecio())
                .comentario(dWishListDTO.getComentario())
                .link(dWishListDTO.getLink())
                .procesarDetail(dWishListDTO.isProcesarDetail())
                .wishList(dWishListDTO.getWishList())
                .build();

    }
}
