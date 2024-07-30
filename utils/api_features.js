class Api_features
{
    constructor(query,query_string)
    {
        this.query=query;
        this.query_string=query_string;
    }

    filter()
    {
        const query_obj={...this.query_string};
        const excluded_fields=["sort","limit","page","fields"];
        excluded_fields.forEach(el => delete query_obj[el]);

        let query_str=JSON.stringify(query_obj);
        query_str=query_str.replace(/\b(gte|lte|lt|gt)\b/g,match => `$${match}`);

        this.query=this.query.find(JSON.parse(query_str));

        return this;
    }

    sort()
    {
        if (this.query_string.sort)
        {
            const sort_by=this.query_string.sort.split(",").join(" ");
            this.query=this.query.sort(sort_by);
        }
        else
        {
            this.query=this.query.sort("-created_at");
        }

        return this;
    }

    limit_fields()
    {
        if (this.query_string.fields)
        {
            const fields=this.query_string.fields.split(",").join(" ");
            this.query=this.query.select(fields);
        }
        else
        {
            this.query=this.query.select("-__v");
        }
        return this;
    }

    paginate()
    {
        const page=this.query_string.page*1 || 1;
        const limit=this.query_string.limit*1 || 10;
        const skip=(page-1)*limit;

        this.query=this.query.skip(skip).limit(limit);

        return this;  
    }
}

module.exports=Api_features;