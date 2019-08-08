import {
    templatingLoop,
    replaceNullOrTempty,
    substrByNum,
    renderLoading,
    addEventClickToElement
} from "../../javascripts/lib/helpers";

class WebAccessDetailModel {
    constructor(o2oApi) {
        this.o2oApi = o2oApi;
        this.page = {
            currentPage: 1,
            pageSize: 5,
            totalPages: 0,
            totalRecords: 0
        }
    }
    async render() {
        return `
        <div class='modal_detail'>
            <div class="card">
                <div class="card-body">
                    ${renderLoading()}
                </div>
                <div class="card-footer">
                    <div class='row'>
                        <div class='col-4'>
                            <select class="form-control" id="itemperpages">
                                <option value='5' selected>5 / page</option>
                                <option value='10'>10 / page</option>
                                <option value='15'>15 / page</option>
                            </select>
                        </div>
                        <div class='col-4'>
                            <nav class='navigation' aria-label="Page navigation example">
                               
                            </nav>
                        </div>
                        <div class='col-2 text-right page-label'>
                            Go to
                        </div>
                        <div class='col-2'>
                            <input class="form-control page-input" id="ccs"></input>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    `
    }
    async read() {
        renderLoading(true, 'div.modal_detail div.card-body')
        var data = (await this.o2oApi.getDetailHistoryWebAccess(this.page.currentPage, this.page.pageSize)).data.results;
        this.page = data.page;
        $("input.page-input").val(this.page.currentPage);
        var render = templatingLoop(data.content, (item) => {
            return ` <div class="row item">
                        <div class="col-10"><b>${moment(item.timestamp).format('hh:mm A DD MMMM YYYY')}</b></div>
                        <div class="col-10">${item.geoLocation} / ${item.device} / ${item.opSystem}</div>
                        <div class="col-10">
                            <a href='${item.domain}${item.urlPath}'>${substrByNum(`${item.domain}${item.urlPath}`, 40)}</a>
                        </div>
                        ${item.refererDomain && `<div class="col-10"><a href=' ${item.refererDomain}${item.refererUrlPath}'>${substrByNum(`${item.refererDomain}${item.refererUrlPath}`, 40)}</a><span class="badge badge-primary">Referer</span> </div>`}
                        <div class="col-10">${item.utmSource} / ${item.utmMedium} / ${item.utmCampaign} ${replaceNullOrTempty(item.utmContent, `/ ${item.utmContent}`)} ${replaceNullOrTempty(item.utmKeyword, `/ ${item.utmKeyword}`)}</div>
                    </div>
                    <hr/>`
        });
        $(".modal_detail div.card-body").html('').html(render);
        this.renderNavPage();
    }
    init() {
        var _this = this;
        $("#itemperpages").on('change', function (item) {
            _this.page.pageSize = parseInt($(item.target).val());
            _this.page.currentPage = 1;
            _this.read();
        });
        $('input.page-input').keyup(function (e) {
            if (e.keyCode === 13 && !isNaN($(e.target).val())) {
                _this.page.currentPage = parseInt($(e.target).val());
                if (_this.page.currentPage >= _this.page.totalPages) {
                    _this.page.currentPage = _this.page.totalPages - 1;
                }
                _this.read();
            }
        });
        $('li.controllPage ').keyup(function (e) {
            if ($(e.target).data().type === 'down')
                _this.page.currentPage = parseInt($(e.target).val()) - 1;
            if ($(e.target).data().type === 'up')
                _this.page.currentPage = parseInt($(e.target).val()) + 1;
            _this.read();
        });

    }
    renderNavPage() {
        let _this = this;
        const html = `<ul class="pagination justify-content-center">
                                    <li  data-page='${_this.page.currentPage - 1}' class="page-item controllPage ${_this.page.currentPage === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0)" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                            <span class="sr-only">Previous</span>
                                        </a>
                                    </li>
                                     ${_this.renderPageNumber()}
                                    <li data-page='${_this.page.currentPage + 1}' class="page-item controllPage ${_this.page.currentPage === _this.page.totalPages - 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0)" aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                            <span class="sr-only">Next</span>
                                        </a>
                                    </li>
                                </ul>`;
        $(".navigation").html('').html(html);
        addEventClickToElement('div.modal_detail li.page-item', (e) => {
            var dataPage = $(e.target).closest('li').data().page;
            if (!isNaN(dataPage) && !$(e.target).closest('li').hasClass('disabled')) {
                _this.page.currentPage = dataPage;
                _this.read();
            }
        });
    }

    renderPageNumber() {
        let _this = this;
        if (_this.page.currentPage >= 1 && _this.page.currentPage < _this.page.totalPages - 1) {
            let past = _this.page.currentPage == 1 ? 1 : _this.page.currentPage - 1;
            return ` <li data-page='${past}'  class="page-item ${_this.page.currentPage === past ? 'active' : ''}"><a class="page-link" href="javascript:void(0)">${past}</a></li>
                                    <li data-page='${past + 1}' class="page-item ${_this.page.currentPage === (past + 1) ? 'active' : ''}"><a class="page-link" href="javascript:void(0)">${past + 1}</a></li>
                                    <li data-page='${past + 2}' class="page-item ${_this.page.currentPage === (past + 2) ? 'active' : ''}"><a class="page-link" href="javascript:void(0)">${past + 2}</a></li>`
        } else if (_this.page >= 3) {
            return ` <li data-page='${_this.page.currentPage - 2}'  class="page-item ${_this.page.currentPage === (_this.page.currentPage - 2) ? 'active' : ''}"><a class="page-link" href="javascript:void(0)">${_this.page.currentPage - 2}</a></li>
                                    <li data-page='${_this.page.currentPage - 1}' class="page-item ${_this.page.currentPage === (_this.page.currentPage - 1) ? 'active' : ''}"><a class="page-link" href="javascript:void(0)">${_this.page.currentPage - 1}</a></li>
                                    <li data-page='${_this.page.currentPage}' class="page-item ${_this.page.currentPage === (_this.page.currentPage) ? 'active' : ''}"><a class="page-link" href="javascript:void(0)">${_this.page.currentPage}</a></li>`
        } else {
            return `<li data-page='${_this.page.currentPage}' class="page-item ${_this.page.currentPage === (_this.page.currentPage) ? 'active' : ''}"><a class="page-link" href="javascript:void(0)">${_this.page.currentPage}</a></li>`
        }
    }
}

export default WebAccessDetailModel