import { Component, OnInit } from '@angular/core';
import { SellersService } from '../sellers.service';
import { Seller } from '../interfaces/seller';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerDlgComponent } from '../seller-dlg/seller-dlg.component';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css']
})
export class SellerListComponent implements OnInit {

  private sellers: Seller[];

  constructor(private service: SellersService,
              private router: Router,
              private modalService: NgbModal,
              private toastrService: ToastrService) { 
                  //toastrConfig.timeOut = 1000;
                  //toastrConfig.maxOpened = 0;
               }

  ngOnInit() {

    // get list of all sellers
    this.service.getSellers().subscribe(allSellers => {
      this.sellers = allSellers;
    });

  }

  onClickSeller(seller: Seller) {
    this.router.navigate(['/seller', seller.id]);
  }

  onAddSeller() {

    const sellerDlgInstance = this.modalService.open(SellerDlgComponent);

    sellerDlgInstance.componentInstance.updateSeller = {id: undefined, name: 'fg', category: '', imagePath: ''};
    
    sellerDlgInstance.result.then(newSeller => {
      
      // call addSeller func in service to post new seller to server
      this.service.addSeller(newSeller).subscribe( succeeded => {
        this.toastrService.success(succeeded.name + ' added to sellers', 'Success!');
      });
      
    }).catch( err => {
      this.toastrService.error('Your changes were not submitted', 'Operation Canceled');
    });

  }

}
