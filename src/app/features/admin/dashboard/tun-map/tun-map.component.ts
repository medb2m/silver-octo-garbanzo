import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService, RegionService } from '@app/_services';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DashboardService } from '@app/_services/dashboard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare const simplemaps_countrymap: any;

@Component({
  selector: 'app-tun-map',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './tun-map.component.html',
  styleUrl: './tun-map.component.css'
})
export class TunMapComponent {

  @ViewChild('regionInfoPop') regionInfoPop!: TemplateRef<any>;
  

  // code MAP
  selectedRegion: any;
  selectedDelegation: any;
  selectedRegionId?: string;
  selectedCity: any;

  isLoading: boolean = true;  // Loading state

  private regionIdMap: { [key: string]: { name: string; value: string } } = {
    TN11: { name: 'Tunis', value: '66a8a5f99a097a430005dad8' },
    TN12: { name: 'Ariana', value: '77b9a6f99a097a430005dad9' },
    TN13: { name: 'Ben Arous', value: '88c9b7f99a097a430005dada' },
    TN14: { name: 'Manubah', value: '99d9c8f99a097a430005dadb' },
    TN21: {
      name: "Nabeul",
      value: "66a8a6299a097a430005daf4"
    },
    TN22: {
      name: "Zaghouan",
      value: "66a8a6539a097a430005db02"
    },
    TN23: {
      name: "Bizerte",
      value: "66a8a6459a097a430005dafb"
    },
    TN31: {
      name: "Béja",
      value: "66a8a68d9a097a430005db25"
    },
    TN32: {
      name: "Jendouba",
      value: "66a8a6979a097a430005db2c"
    },
    TN33: {
      name: "Le Kef",
      value: "66a8a6a09a097a430005db33"
    },
    TN34: {
      name: "Siliana",
      value: "66a8a6ab9a097a430005db3a"
    },
    TN41: {
      name: "Kairouan",
      value: "66a8a6b59a097a430005db41"
    },
    TN42: {
      name: "Kassérine",
      value: "66a8a6cb9a097a430005db4f"
    },
    TN43: {
      name: "Sidi Bou Zid",
      value: "66a8a6bf9a097a430005db48"
    },
    TN51: {
      name: "Sousse",
      value: "66a8a65d9a097a430005db09"
    },
    TN52: {
      name: "Monastir",
      value: "66a8a66b9a097a430005db10"
    },
    TN53: {
      name: "Mahdia",
      value: "66a8a6779a097a430005db17"
    },
    TN61: {
      name: "Sfax",
      value: "66a8a6819a097a430005db1e"
    },
    TN71: {
      name: "Gafsa",
      value: "66a8a6f49a097a430005db64"
    },
    TN72: {
      name: "Tozeur",
      value: "66a8a7019a097a430005db6b"
    },
    TN73: {
      name: "Kebili",
      value: "66a8a7159a097a430005db79"
    },
    TN81: {
      name: "Gabès",
      value: "66a8a6d99a097a430005db56"
    },
    TN82: {
      name: "Médenine",
      value: "66a8a6e99a097a430005db5d"
    },
    TN83: {
      name: "Tataouine",
      value: "66a8a70c9a097a430005db72"
    }
  }; 


  constructor(
    private regionService: RegionService,
    private router: Router,
    private dashboard: DashboardService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.loadMapScripts();
    (window as any).angularComponent = {
      selectRegion: (regionId: string) => this.selectRegion(regionId),
    };

    // Show loading for 4 seconds, then load the map
    setTimeout(() => {
      this.isLoading = false;  // Stop loading after 4 seconds
    }, 4000);  // 4000ms = 4 seconds
    
    
  }

  ngOnDestroy() {
    
  }

  loadMapScripts() {
    const script1 = document.createElement('script');
    script1.src = 'http://localhost:4000/map/mapdata.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'http://localhost:4000/map/countrymap.js';
      script2.onload = () => {
        this.addRegionClickListeners(); 
      };
      document.body.appendChild(script2);
    };
    document.body.appendChild(script1);
  }
  addRegionClickListeners() {
    // Assuming regions have IDs matching the keys in state_specific
  const regionIds = Object.keys(this.regionIdMap); // Get all region IDs from the mapping

  regionIds.forEach(regionId => {
    const regionElement = document.getElementById(regionId);
    if (regionElement) {
      regionElement.addEventListener('click', () => {
        this.selectedRegion = this.regionIdMap[regionId].value;  
      });
    }
  });
  }
  selectRegion(regionId: string) {
    // Get the selected region's data
    const regionData = this.regionIdMap[regionId];

    if (regionData) {
      console.log('Region selected in Angular:', regionData.name);
      this.selectedRegion = regionData;
      
      // Fetch data and open the popup
      this.openRegionPopup(regionData);
    } else {
      console.error('Region not found');
    }
  }
  

  previousData = {
    reportCount: 101,
    treatedReports: 0,
    untreatedReports: 0,
    workerCount: 0,
    option1Reports: 0,
  };

  openRegionPopup(regionData: any) {
  this.regionService.getReportsByRegionId(regionData.value).subscribe(regionDetails => {
    this.selectedRegion = {
      ...regionData,
      reportCount: regionDetails.region.reportCount,
      workerCount: regionDetails.region.workerCount,
      treatedReports: regionDetails.region.treatedReports,
      untreatedReports: regionDetails.region.untreatedReports,
      importantReports: regionDetails.region.importantReports,
    };

    this.modalService.open(this.regionInfoPop);
    console.log('opened')
  });
}

  /* openRegionPopup(regionData: any) {
    // Fetch the reports for the selected region
    console.log('enter pop fun')
    this.regionService.getReportsByRegionId(regionData.value).subscribe(regionDetails => {
      console.log('enter sub')
      const treatedReports = regionDetails.reports.filter((report: any) => report.status === 'treated');
      const untreatedReports = regionDetails.reports.filter((report: any) => report.status === 'untreated');
      console.log('filer report status')
      this.selectedRegion = {
        ...regionData,
        reportCount: regionDetails.reportCount,
        workerCount: regionDetails.workerCount,
        treatedReports: treatedReports.length,
        untreatedReports: untreatedReports.length,
      };
      console.log('fill with data')
  
      // Open the modal with region-specific details
      this.modalService.open(this.regionInfoPop, { centered: true });
    });
  } */ 
  
  /* openRegionPopup(regionData: any) {
    // Fetch the reports and workers for the selected region
    this.regionService.getRegionDetails(regionData._id).subscribe(regionDetails => {
      this.selectedRegion = {
        ...regionData,
        reportCount: regionDetails.reportCount,
        workerCount: regionDetails.workerCount,
        treatedReports: regionDetails.treatedReports,
        untreatedReports: regionDetails.untreatedReports,
        option1Reports: regionDetails.option1Reports,
      };

      // Open the modal with region-specific details
      this.modalService.open(this.regionInfoPop, { centered: true });
    });
  }  */

  

  closePopup() {
    this.modalService.dismissAll();
  }
}
