import React from 'react';

class Action extends React.Component {
    render() {
        if (this.shouldRender()) {
            return (
                <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="single-shop-item">
                        <div className="img-box">
                            <a href="shop-cart.html"><img src={this.props.image} alt="Awesome Image" /></a>
                            <figcaption className="overlay">
                                <div className="box">
                                    <div className="content">
                                        <a href={this.props.match.url+"/"+this.props.id}><i className="fa fa-link" aria-hidden="true"></i></a>
                                    </div>
                                </div>
                            </figcaption>
                        </div>
                        <div className="content-box">
                            <div className="inner-box">
                                <h4><a href={this.props.match.url+"/"+this.props.id}>{this.props.title}</a></h4>
                                {/* <div className="item-price">{this.props.description}</div> */}
                            </div>
                            <div className="price-box">
                                <div className="clearfix">
                                    <div className="float_left">
                                        <a href={this.props.match.url+"/"+this.props.id} className="thm-btn style-4">More Info...</a>
                                    </div>
                                    <div className="float_right">
                                        <a href="shop-cart.html" className="thm-btn style-4">Done It</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div></div>
        }
    }
    //checks the filters to see if the action should render or not
    shouldRender() {
        //need both the tags and the categories to fit
        var catsfit=this.filterFits("categories",this.props.allcategories, this.props.categories);
        var tagsfit=this.filterFits("tags",this.props.alltags, this.props.tags);
        var difficultyfits=this.filterFits("difficulties",this.props.alldifficulties,[this.props.difficulty]);
        var impactfits=this.filterFits("impacts",this.props.allimpacts,[this.props.impact]);

        return (catsfit && tagsfit && difficultyfits && impactfits); //need the tags and the cats to fit
    }
    //checks if none of the boxes are checked, in which case, all the actions should show
    //takes in the name of the filter, and the filter
    noFilter(filtername,filter) {
        for (var i in filter) {
            var checkbox = document.getElementById(filtername+"-"+filter[i]);
            if (checkbox && checkbox.checked)
                return false;
        }
        return true;
    }
    //checks if any of the options are checked off in the filter
    //takes in the name of the filter, the filter and the actions' options for that filter
    filterFits(filtername,filter, options) {
        if (this.noFilter(filtername,filter)){ //if nothing is checked then just default to true
            return true;
        }else{
            for(var i in options){
                var checkbox = document.getElementById(filtername+"-"+options[i]);
                if (checkbox && checkbox.checked) { //if the checkbox exists and is checked
                    return true;
                }
            }
        }
        return false;
    }
        
    //     //if the action's category is checked
    //     if (!this.props.noFilter(this.props.allcategories)) {
    //         if (document.getElementById(this.props.category) && document.getElementById(this.props.category).checked) {
    //             if (this.props.noFilter(this.props.alltags)) //if there are no tag filters
    //                 return true;
    //             for (var i in this.props.tags) { //if any of the tags are checked
    //                 if (document.getElementById(this.props.tags[i]) && document.getElementById(this.props.tags[i]).checked)
    //                     return true;
    //             }
    //         }
    //     }
    //     for (var i in this.props.tags) { //if any of the tags are checked
    //         if (document.getElementById(this.props.tags[i]) && document.getElementById(this.props.tags[i]).checked)
    //             return true;
    //     }
    //     return false;
    // }
}
export default Action;